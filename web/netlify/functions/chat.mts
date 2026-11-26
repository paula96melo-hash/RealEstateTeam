// Netlify Function: the only place the Claude API is called. The API key stays on the server
// (ANTHROPIC_API_KEY in Netlify environment variables) and never reaches the browser.
//
// GET  /api/chat -> { mode: "live" | "demo", passwordRequired, apiKeyConfigured }
// POST /api/chat -> one model call per request, streamed back as NDJSON lines:
//   {"type":"text","text":"..."} ... {"type":"done", ...} or {"type":"error","message":"..."}
// Modes: "agent" (chat with one expert), and the four team stages the browser runs in order:
//   "plan" (orchestrator picks experts) -> "expert" (each specialist) -> "review" (compliance/consent)
//   -> "synthesize" (orchestrator writes one answer).
// The app is draft-only: nothing here sends, posts, publishes, or buys anything.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { isAuthorized, passwordRequired } from "../lib/auth.ts";
import { AGENTS, ORCHESTRATOR, REVIEWERS, SPECIALISTS, systemPromptFor } from "../lib/team.ts";

export const config = { path: "/api/chat" };

type Effort = "low" | "medium" | "high";
// Each request must finish inside Netlify's function time limit, so output is kept bounded.
const LIMITS = {
  agent: { maxTokens: 6000, effort: "medium" as Effort },
  plan: { maxTokens: 2500, effort: "low" as Effort },
  expert: { maxTokens: 4000, effort: "low" as Effort },
  review: { maxTokens: 3000, effort: "low" as Effort },
  synthesize: { maxTokens: 5000, effort: "medium" as Effort },
};
const MAX_MESSAGES = 30;
const MAX_CHARS = 24_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const clip = (s: unknown, max = MAX_CHARS) => String(s ?? "").slice(0, max);

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic()); // reads ANTHROPIC_API_KEY from the environment

/** Server-side refusal fallback is supported on the Opus and Sonnet models used here, not on Haiku. */
function fallbackParams(modelId: string) {
  return modelId.includes("haiku")
    ? {}
    : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };
}

function errorMessage(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return "The Claude API key is missing or invalid. Check ANTHROPIC_API_KEY in Netlify.";
  if (err instanceof Anthropic.RateLimitError) return "Rate limited by the Claude API. Wait a moment and try again.";
  if (err instanceof Anthropic.BadRequestError) return `The Claude API rejected the request: ${err.message}`;
  if (err instanceof Anthropic.APIError) return `Claude API error ${err.status ?? ""}: ${err.message}`;
  if (err instanceof Error && err.name === "AbortError") return "Request cancelled.";
  return err instanceof Error ? err.message : "Unknown error";
}

function streamFromModel(
  req: Request,
  agentName: string,
  messages: Anthropic.Beta.BetaMessageParam[],
  limits: { maxTokens: number; effort: Effort },
): Response {
  const agent = AGENTS.get(agentName)!;
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      send({ type: "start", agent: agent.name, model: agent.modelId });
      try {
        const stream = getClient().beta.messages.stream(
          {
            model: agent.modelId,
            max_tokens: limits.maxTokens,
            cache_control: { type: "ephemeral" },
            output_config: { effort: limits.effort },
            system: systemPromptFor(agent.name),
            messages,
            ...fallbackParams(agent.modelId),
          },
          { signal: req.signal },
        );
        stream.on("text", (text) => send({ type: "text", text }));
        const final = await stream.finalMessage();
        send({
          type: "done",
          stopReason: final.stop_reason,
          servedBy: final.model,
          refusal: final.stop_reason === "refusal" ? final.stop_details?.explanation ?? "The model declined this request." : null,
          usage: { input: final.usage.input_tokens, output: final.usage.output_tokens, cacheRead: final.usage.cache_read_input_tokens ?? 0 },
        });
      } catch (err) {
        send({ type: "error", message: errorMessage(err) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(body, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" },
  });
}

// ---------- team stages ----------
const SPECIALIST_ENUM = SPECIALISTS as [string, ...string[]];
const PlanSchema = z.object({
  framing: z.string().describe("One or two sentences restating the question and the decision it supports."),
  experts: z
    .array(z.object({ agent: z.enum(SPECIALIST_ENUM), brief: z.string() }))
    .describe("The smallest set of specialists (1 to 5) that covers the question, each with a self-contained brief."),
  needs_compliance: z.boolean().describe("True if any expert will draft outward-facing material."),
  needs_consent: z.boolean().describe("True if anything involves calls, texts, emails to contacts, consent, or contact data."),
});

function planPrompt(question: string, context: string): string {
  return `You are planning how the team answers the consultant's question. In this web app you cannot spawn agents yourself; the app will run the experts you choose and send their answers back to you for the final synthesis.

Pick the smallest set of 1 to 5 specialists using your routing table. Put Dan's budget and weekly-hours limits from your business brief into every brief they affect. Do not pick compliance-reviewer or consent-privacy-advisor as experts; set needs_compliance and needs_consent instead, and the app will run them after the drafts exist. Write each brief so the expert can work without seeing this conversation: the specific sub-question, what to focus on, and the output you want back.

needs_compliance = true if any expert will draft outward-facing material (posts, ads, emails, texts, web copy, flyers, scripts, event invites, ad targeting).
needs_consent = true if anything involves calls, texts, emails to contacts, consent capture, or contact data.
${context ? `\nRecent conversation, for context:\n${context}\n` : ""}
Question: ${question}`;
}

const expertPrompt = (brief: string, question: string) =>
  `Morgan, the Program Lead, is coordinating a team answer and asks you:

${brief}

The consultant's original question: ${question}

Answer in about 450 words or fewer (drafted copy can be extra). Put any draft copy under a heading "DRAFT — NOT SENT". Cite sources from your included docs and knowledge files with dates and confidence markers, and say "unverified" where you would need live data.`;

function reviewPrompt(reviewer: string, question: string, outputs: { agent: string; text: string }[]): string {
  const focus =
    reviewer === "compliance-reviewer"
      ? "Apply your full checklist (fair housing including Palm Beach County classes, FREC advertising, RESPA, platform ad policy) to every draft and every targeting choice."
      : "Check every call, text, email, consent, Do-Not-Call, and contact-data element (TCPA, Florida Telephone Solicitation Act, CAN-SPAM, privacy).";
  return `The team drafted the material below for the consultant's question. Review it before it reaches the human. ${focus}
Give PASS / REVISE / ESCALATE per item, quoting each issue and giving the fix. A PASS means "ready for human approval", never "approved to send". Keep it under 400 words.

Question: ${question}

${outputs.map((o) => `### From ${o.agent}\n${clip(o.text, 8000)}`).join("\n\n")}`;
}

function synthesisPrompt(question: string, framing: string, outputs: { agent: string; text: string }[], reviews: { agent: string; text: string }[], context: string): string {
  return `Your experts have answered. Combine their work into one answer for the consultant, using your expert-panel-synthesis format.
- Apply your decision rules in order: compliance (Grace) and consent (Ivy) findings override marketing; Dan's budget and weekly-hours limits from your business brief override any plan that exceeds them; anything uncertain, about money, legal risk, or client contact goes to Dan. For each disagreement between experts, state it, the tie-breaker you used, and your final recommendation.
- You recommend; Dan decides. Include a "Dan must approve" section, and end with a "Decision log entry" (status PROPOSED) as described in your decision-log skill.
- In this web app there is no drafts/ folder. Replace the "Awaiting your approval" section with "Drafts in this answer (not sent)", listing each draft and what review it still needs.
- About 700 words plus any drafts. Keep citations and confidence markers.
${context ? `\nRecent conversation, for context:\n${context}\n` : ""}
Question: ${question}
Your framing: ${framing}

${outputs.map((o) => `### Expert: ${o.agent}\n${clip(o.text, 8000)}`).join("\n\n")}

${reviews.length ? reviews.map((r) => `### Reviewer: ${r.agent}\n${clip(r.text, 6000)}`).join("\n\n") : "No compliance or consent review was needed for this question."}`;
}

// ---------- handler ----------
export default async (req: Request): Promise<Response> => {
  if (req.method === "GET") {
    const live = Boolean(process.env.ANTHROPIC_API_KEY);
    // No API key -> demo mode: the browser shows saved example answers and makes no model calls.
    return json({ mode: live ? "live" : "demo", passwordRequired: live && passwordRequired(), apiKeyConfigured: live });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ demo: true, error: "Demo mode: no API key is set, so live answers are off. Add ANTHROPIC_API_KEY in Netlify and redeploy to turn them on." }, 503);
  }
  if (!isAuthorized(req)) return json({ error: "Wrong or missing password." }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const mode = String(body.mode ?? "");
  const question = clip(body.question, 8000);
  const context = clip(body.context, 6000);

  switch (mode) {
    case "agent": {
      const agent = String(body.agent ?? "");
      if (!AGENTS.has(agent)) return json({ error: `Unknown agent: ${agent}` }, 400);
      const raw = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
      const messages: Anthropic.Beta.BetaMessageParam[] = raw
        .filter((m): m is { role: string; content: string } => !!m && typeof m === "object" && "role" in m && "content" in m)
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role as "user" | "assistant", content: clip(m.content) }))
        .filter((m) => m.content.trim().length > 0);
      while (messages.length && messages[0].role !== "user") messages.shift();
      if (!messages.length || messages[messages.length - 1].role !== "user") {
        return json({ error: "The conversation must end with a user message." }, 400);
      }
      return streamFromModel(req, agent, messages, LIMITS.agent);
    }

    case "plan": {
      if (!question.trim()) return json({ error: "Question is required." }, 400);
      const lead = AGENTS.get(ORCHESTRATOR)!;
      try {
        const response = await getClient().beta.messages.parse(
          {
            model: lead.modelId,
            max_tokens: LIMITS.plan.maxTokens,
            cache_control: { type: "ephemeral" },
            output_config: { effort: LIMITS.plan.effort, format: betaZodOutputFormat(PlanSchema) },
            system: systemPromptFor(ORCHESTRATOR),
            messages: [{ role: "user", content: planPrompt(question, context) }],
            ...fallbackParams(lead.modelId),
          },
          { signal: req.signal },
        );
        if (response.stop_reason === "refusal") {
          return json({ error: response.stop_details?.explanation ?? "The Program Lead declined this request." }, 422);
        }
        const plan = response.parsed_output;
        if (!plan) return json({ error: "The Program Lead did not return a usable plan. Try rephrasing the question." }, 502);
        const seen = new Set<string>();
        const experts = plan.experts.filter((e) => SPECIALISTS.includes(e.agent) && !seen.has(e.agent) && seen.add(e.agent)).slice(0, 5);
        if (!experts.length) return json({ error: "The plan named no experts. Try rephrasing the question." }, 502);
        return json({ ...plan, experts });
      } catch (err) {
        return json({ error: errorMessage(err) }, 502);
      }
    }

    case "expert": {
      const agent = String(body.agent ?? "");
      if (!SPECIALISTS.includes(agent)) return json({ error: `Not a team specialist: ${agent}` }, 400);
      if (!question.trim()) return json({ error: "Question is required." }, 400);
      return streamFromModel(req, agent, [{ role: "user", content: expertPrompt(clip(body.brief, 4000), question) }], LIMITS.expert);
    }

    case "review": {
      const agent = String(body.agent ?? "");
      if (!(REVIEWERS as readonly string[]).includes(agent)) return json({ error: `Not a reviewer: ${agent}` }, 400);
      const outputs = parseOutputs(body.outputs);
      return streamFromModel(req, agent, [{ role: "user", content: reviewPrompt(agent, question, outputs) }], LIMITS.review);
    }

    case "synthesize": {
      const outputs = parseOutputs(body.outputs);
      const reviews = parseOutputs(body.reviews);
      const content = synthesisPrompt(question, clip(body.framing, 2000), outputs, reviews, context);
      return streamFromModel(req, ORCHESTRATOR, [{ role: "user", content }], LIMITS.synthesize);
    }

    default:
      return json({ error: `Unknown mode: ${mode}` }, 400);
  }
};

function parseOutputs(value: unknown): { agent: string; text: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 7)
    .filter((o): o is { agent: string; text: string } => !!o && typeof o === "object" && "agent" in o && "text" in o)
    .filter((o) => AGENTS.has(String(o.agent)))
    .map((o) => ({ agent: String(o.agent), text: clip(o.text, 12_000) }));
}
