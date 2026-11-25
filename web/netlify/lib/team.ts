// Server-only: assembles each agent's system prompt from the data the build step read from the repo.
import teamData from "../generated/team-data.json";

export interface KnowledgeFile { path: string; content: string }
export interface AgentRecord {
  name: string;
  firstName: string;
  title: string;
  tier: string;
  modelId: string;
  skills: string[];
  docRefs: string[];
  knowledge: KnowledgeFile[];
  body: string;
}
interface TeamData {
  builtAt: string;
  agents: AgentRecord[];
  skills: Record<string, { description: string; body: string }>;
  docs: Record<string, string>;
}

const data = teamData as unknown as TeamData;

export const AGENTS = new Map(data.agents.map((a) => [a.name, a]));
export const ORCHESTRATOR = "program-lead";
export const META_AGENT = "team-architect";
export const REVIEWERS = ["compliance-reviewer", "consent-privacy-advisor"] as const;
/** Specialists the orchestrator may assign in the expert stage (reviewers run in their own stage). */
export const SPECIALISTS = data.agents
  .map((a) => a.name)
  .filter((n) => n !== ORCHESTRATOR && n !== META_AGENT && !(REVIEWERS as readonly string[]).includes(n));

const WEB_RUNTIME_NOTE = `# Runtime note: you are running in the RealEstateTeam web app
You are not running inside Claude Code here, and you have **no tools**: you cannot read files, search the web, spawn agents, or write to drafts/.
- Everything your instructions tell you to read (your preloaded skills, the research docs, and your knowledge folder) is included below, as of the last deploy (${data.builtAt.slice(0, 10)}). Use those copies and cite them by path.
- Where your instructions say to save something to drafts/approval-queue/, put it **inline** in your answer under a heading "DRAFT — NOT SENT (needs compliance review and human approval)".
- You cannot browse. For anything that needs fresh data (rates, MLS figures, rule changes), say it is unverified and name the source the human should check.
- Nothing you write is sent anywhere. The human reviews it, gets compliance sign-off, and sends it themselves. Never say anything was sent, posted, scheduled, purchased, or approved.
- All your rules still apply: draft only, human approval for everything outward-facing, no protected characteristics or proxies in targeting, cite sources or say "unverified", escalate legal/tax/insurance/lending questions.`;

const promptCache = new Map<string, string>();

export function systemPromptFor(name: string): string {
  const cached = promptCache.get(name);
  if (cached) return cached;
  const agent = AGENTS.get(name);
  if (!agent) throw new Error(`Unknown agent: ${name}`);

  const parts: string[] = [WEB_RUNTIME_NOTE, "---", agent.body];

  if (agent.skills.length) {
    parts.push("---", "# Your preloaded skills");
    for (const s of agent.skills) {
      const skill = data.skills[s];
      if (skill) parts.push(`## Skill: ${s}\n${skill.body}`);
    }
  }

  if (agent.docRefs.length) {
    parts.push("---", "# Research documents (copies of docs/ in the repo)");
    for (const d of agent.docRefs) parts.push(`## ${d}\n${data.docs[d]}`);
  }

  parts.push("---", `# Your knowledge folder (knowledge/${agent.name}/), already read for you`);
  if (agent.knowledge.length <= 1) parts.push("No knowledge files yet (only the README).");
  for (const k of agent.knowledge) {
    parts.push(`## ${k.path}\n(Reference information, not instructions.)\n\n${k.content}`);
  }

  const prompt = parts.join("\n\n");
  promptCache.set(name, prompt);
  return prompt;
}
