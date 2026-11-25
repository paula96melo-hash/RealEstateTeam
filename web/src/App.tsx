import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import teamJson from "./generated/team.json";
import {
  getConfig,
  getPassword,
  requestPlan,
  setPassword,
  streamRequest,
  UnauthorizedError,
  type Plan,
  type ServerConfig,
} from "./api";

// ---------- types ----------
interface Agent {
  name: string;
  firstName: string;
  title: string;
  description: string;
  group: string;
  color: string;
  tier: string;
  modelId: string;
  voice: string;
  style: string;
  skillCount: number;
  knowledgeFiles: string[];
}
type Status = "planning" | "working" | "streaming" | "done" | "error" | "stopped";
interface Step {
  agent: string;
  kind: "expert" | "review";
  brief?: string;
  text: string;
  status: Status;
  note?: string;
}
interface ChatItem {
  id: string;
  role: "user" | "assistant";
  agent?: string;
  text: string;
  status: Status;
  note?: string;
  plan?: Plan;
  steps?: Step[];
}

const TEAM: Agent[] = teamJson as Agent[];
const BY_NAME = new Map(TEAM.map((a) => [a.name, a]));
const TEAM_KEY = "__team__";
const LEAD = "program-lead";

const uid = () => Math.random().toString(36).slice(2, 10);
const who = (name?: string) => {
  const a = name ? BY_NAME.get(name) : undefined;
  return a ? `${a.firstName} · ${a.title}` : name ?? "";
};

// ---------- small components ----------
function ModelBadge({ tier }: { tier: string }) {
  return <span className={`badge badge-${tier}`}>{tier}</span>;
}

function Markdown({ text }: { text: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" /> }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="ghost small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
    >
      {copied ? "Copied" : "Copy draft"}
    </button>
  );
}

function StatusDot({ status }: { status: Status }) {
  const label: Record<Status, string> = {
    planning: "Planning",
    working: "Waiting",
    streaming: "Writing",
    done: "Done",
    error: "Error",
    stopped: "Stopped",
  };
  return <span className={`status status-${status}`}>{label[status]}</span>;
}

function PasswordGate({ onSubmit, error }: { onSubmit: (pw: string) => void; error: string }) {
  const [pw, setPw] = useState("");
  return (
    <div className="gate">
      <form
        className="gate-card"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(pw);
        }}
      >
        <h1>Expert Team</h1>
        <p>This app is password protected.</p>
        <input type="password" autoFocus placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {error && <p className="error-text">{error}</p>}
        <button className="primary" type="submit" disabled={!pw}>
          Enter
        </button>
      </form>
    </div>
  );
}

// ---------- sidebar ----------
function Sidebar({
  selected,
  onSelect,
  open,
}: {
  selected: string;
  onSelect: (key: string) => void;
  open: boolean;
}) {
  const groups = useMemo(() => {
    const m = new Map<string, Agent[]>();
    for (const a of TEAM) {
      if (a.name === LEAD) continue;
      m.set(a.group, [...(m.get(a.group) ?? []), a]);
    }
    return [...m.entries()];
  }, []);
  const lead = BY_NAME.get(LEAD);

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <strong>Expert Team</strong>
        <span>West Palm Beach Realtor marketing</span>
      </div>
      <button className={`team-button ${selected === TEAM_KEY ? "active" : ""}`} onClick={() => onSelect(TEAM_KEY)}>
        <span className="team-title">Ask the whole team</span>
        <span className="team-sub">
          {lead?.firstName ?? "Program Lead"} picks the experts and returns one answer
        </span>
      </button>
      <nav>
        {lead && <AgentRow agent={lead} active={selected === lead.name} onSelect={onSelect} />}
        {groups.map(([group, agents]) => (
          <div key={group} className="group">
            <div className="group-label">{group}</div>
            {agents.map((a) => (
              <AgentRow key={a.name} agent={a} active={selected === a.name} onSelect={onSelect} />
            ))}
          </div>
        ))}
      </nav>
      <p className="sidebar-foot">Drafts only. Nothing is sent from this app.</p>
    </aside>
  );
}

function AgentRow({ agent, active, onSelect }: { agent: Agent; active: boolean; onSelect: (k: string) => void }) {
  return (
    <button className={`agent-row ${active ? "active" : ""}`} onClick={() => onSelect(agent.name)} title={agent.description}>
      <span className={`avatar c-${agent.color}`}>{agent.firstName[0]}</span>
      <span className="agent-text">
        <span className="agent-line">
          <span className="agent-name">{agent.firstName}</span>
          <ModelBadge tier={agent.tier} />
        </span>
        <span className="agent-title">{agent.title}</span>
        <span className="agent-voice">{agent.voice}</span>
      </span>
    </button>
  );
}

// ---------- chat ----------
function TeamSteps({ item }: { item: ChatItem }) {
  if (!item.plan && item.status === "planning") {
    return <p className="muted">Morgan is deciding which experts to bring in…</p>;
  }
  if (!item.steps?.length) return null;
  return (
    <div className="steps">
      {item.plan && <p className="muted framing">{item.plan.framing}</p>}
      {item.steps.map((s, i) => (
        <details key={`${s.agent}-${i}`} className="step">
          <summary>
            <span className={`avatar tiny c-${BY_NAME.get(s.agent)?.color ?? "gray"}`}>{BY_NAME.get(s.agent)?.firstName[0]}</span>
            <span className="step-name">
              {who(s.agent)} {s.kind === "review" && <em>(review)</em>}
            </span>
            <StatusDot status={s.status} />
          </summary>
          {s.brief && (
            <p className="brief">
              <strong>Brief:</strong> {s.brief}
            </p>
          )}
          {s.text ? <Markdown text={s.text} /> : <p className="muted">Waiting…</p>}
          {s.note && <p className="note">{s.note}</p>}
        </details>
      ))}
    </div>
  );
}

function Message({ item }: { item: ChatItem }) {
  if (item.role === "user") {
    return (
      <div className="msg user">
        <div className="bubble">{item.text}</div>
      </div>
    );
  }
  const agent = item.agent ? BY_NAME.get(item.agent) : undefined;
  return (
    <div className="msg assistant">
      <div className="msg-head">
        <span className={`avatar c-${agent?.color ?? "gray"}`}>{agent?.firstName[0] ?? "?"}</span>
        <span className="msg-who">{who(item.agent)}</span>
        {agent && <ModelBadge tier={agent.tier} />}
        <StatusDot status={item.status} />
      </div>
      {item.steps !== undefined && <TeamSteps item={item} />}
      {item.text && (
        <div className="bubble draft">
          <div className="draft-label">DRAFT, NOT SENT · review before using</div>
          <Markdown text={item.text} />
          {item.status === "done" && (
            <div className="msg-actions">
              <CopyButton text={item.text} />
            </div>
          )}
        </div>
      )}
      {item.note && <p className="note">{item.note}</p>}
    </div>
  );
}

const STARTERS_TEAM = [
  "Build me a 90-day lead-generation plan for my first quarter with $400/month and 10 hours a week.",
  "Should I position myself as the condo due-diligence expert in West Palm Beach? Draft a launch plan.",
  "Design my open-house-to-client follow-up system, including a compliant sign-in form.",
];

export default function App() {
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [configError, setConfigError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [selected, setSelected] = useState<string>(TEAM_KEY);
  const [conversations, setConversations] = useState<Record<string, ChatItem[]>>({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getConfig()
      .then((c) => {
        setConfig(c);
        setAuthed(!c.passwordRequired || Boolean(getPassword()));
      })
      .catch((e: Error) => setConfigError(e.message));
  }, []);

  const items = conversations[selected] ?? [];
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items]);

  const update = useCallback((key: string, id: string, fn: (m: ChatItem) => ChatItem) => {
    setConversations((prev) => ({ ...prev, [key]: (prev[key] ?? []).map((m) => (m.id === id ? fn(m) : m)) }));
  }, []);
  const push = useCallback((key: string, ...msgs: ChatItem[]) => {
    setConversations((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), ...msgs] }));
  }, []);

  const handleError = useCallback(
    (key: string, id: string, err: unknown) => {
      if (err instanceof UnauthorizedError) {
        setPassword("");
        setAuthed(false);
        setAuthError("Wrong or missing password.");
      }
      const aborted = err instanceof DOMException && err.name === "AbortError";
      update(key, id, (m) => ({
        ...m,
        status: aborted ? "stopped" : "error",
        note: aborted ? "Stopped." : err instanceof Error ? err.message : String(err),
      }));
    },
    [update],
  );

  const cutOffNote = (r: { cutOff: boolean; refusal?: string | null; stopReason?: string | null }) =>
    r.refusal
      ? `The model declined: ${r.refusal}`
      : r.cutOff
        ? "The response was cut off (most likely the server time limit). Try a narrower question."
        : r.stopReason === "max_tokens"
          ? "The response hit its length limit. Ask a follow-up to continue."
          : undefined;

  // ----- talk to one agent -----
  async function askAgent(agentName: string, text: string) {
    const key = agentName;
    const history = (conversations[key] ?? [])
      .filter((m) => m.status === "done" || m.role === "user")
      .map((m) => ({ role: m.role, content: m.text }));
    const user: ChatItem = { id: uid(), role: "user", text, status: "done" };
    const reply: ChatItem = { id: uid(), role: "assistant", agent: agentName, text: "", status: "streaming" };
    push(key, user, reply);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const r = await streamRequest(
        { mode: "agent", agent: agentName, messages: [...history, { role: "user", content: text }] },
        (full) => update(key, reply.id, (m) => ({ ...m, text: full })),
        ac.signal,
      );
      update(key, reply.id, (m) => ({ ...m, status: "done", note: cutOffNote(r) }));
    } catch (err) {
      handleError(key, reply.id, err);
    }
  }

  // ----- ask the whole team (orchestrated by the Program Lead) -----
  async function askTeam(question: string) {
    const key = TEAM_KEY;
    const prior = (conversations[key] ?? []).filter((m) => m.status === "done");
    const context = prior
      .slice(-4)
      .map((m) => `${m.role === "user" ? "Q" : "A"}: ${m.text.slice(0, 1500)}`)
      .join("\n");
    const user: ChatItem = { id: uid(), role: "user", text: question, status: "done" };
    const reply: ChatItem = { id: uid(), role: "assistant", agent: LEAD, text: "", status: "planning", steps: [] };
    push(key, user, reply);
    const ac = new AbortController();
    abortRef.current = ac;

    const setStep = (i: number, patch: Partial<Step>) =>
      update(key, reply.id, (m) => ({ ...m, steps: (m.steps ?? []).map((s, j) => (j === i ? { ...s, ...patch } : s)) }));

    const runStep = async (i: number, payload: Record<string, unknown>) => {
      setStep(i, { status: "streaming" });
      try {
        const r = await streamRequest(payload, (full) => setStep(i, { text: full }), ac.signal);
        setStep(i, { status: "done", text: r.text, note: cutOffNote(r) });
        return r.text;
      } catch (err) {
        setStep(i, { status: "error", note: err instanceof Error ? err.message : String(err) });
        if (err instanceof UnauthorizedError || (err instanceof DOMException && err.name === "AbortError")) throw err;
        return "";
      }
    };

    try {
      const plan = await requestPlan(question, context, ac.signal);
      const reviewers = [plan.needs_compliance && "compliance-reviewer", plan.needs_consent && "consent-privacy-advisor"].filter(
        Boolean,
      ) as string[];
      const steps: Step[] = [
        ...plan.experts.map((e) => ({ agent: e.agent, kind: "expert" as const, brief: e.brief, text: "", status: "working" as Status })),
        ...reviewers.map((r) => ({ agent: r, kind: "review" as const, text: "", status: "working" as Status })),
      ];
      update(key, reply.id, (m) => ({ ...m, plan, steps, status: "working" }));

      // 1) experts in parallel
      const expertTexts = await Promise.all(
        plan.experts.map((e, i) => runStep(i, { mode: "expert", agent: e.agent, brief: e.brief, question })),
      );
      const outputs = plan.experts.map((e, i) => ({ agent: e.agent, text: expertTexts[i] })).filter((o) => o.text);
      if (!outputs.length) throw new Error("None of the experts returned an answer.");

      // 2) compliance / consent review in parallel, after drafts exist
      const reviewTexts = await Promise.all(
        reviewers.map((r, j) => runStep(plan.experts.length + j, { mode: "review", agent: r, question, outputs })),
      );
      const reviews = reviewers.map((r, j) => ({ agent: r, text: reviewTexts[j] })).filter((o) => o.text);

      // 3) the Program Lead writes one combined answer
      update(key, reply.id, (m) => ({ ...m, status: "streaming" }));
      const r = await streamRequest(
        { mode: "synthesize", question, framing: plan.framing, outputs, reviews, context },
        (full) => update(key, reply.id, (m) => ({ ...m, text: full })),
        ac.signal,
      );
      update(key, reply.id, (m) => ({ ...m, status: "done", note: cutOffNote(r) }));
    } catch (err) {
      handleError(key, reply.id, err);
    }
  }

  async function send(textArg?: string) {
    const text = (textArg ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    try {
      if (selected === TEAM_KEY) await askTeam(text);
      else await askAgent(selected, text);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  // ----- render -----
  if (configError) {
    return (
      <div className="gate">
        <div className="gate-card">
          <h1>Expert Team</h1>
          <p className="error-text">{configError}</p>
          <p className="muted">If you are running locally, use `npx netlify dev` so the server function is available.</p>
        </div>
      </div>
    );
  }
  if (!config) return <div className="gate"><p className="muted">Loading…</p></div>;
  if (!authed) {
    return (
      <PasswordGate
        error={authError}
        onSubmit={(pw) => {
          setPassword(pw);
          setAuthError("");
          setAuthed(true);
        }}
      />
    );
  }

  const current = selected === TEAM_KEY ? null : BY_NAME.get(selected);
  const lead = BY_NAME.get(LEAD);

  return (
    <div className="layout">
      <Sidebar
        selected={selected}
        open={sidebarOpen}
        onSelect={(k) => {
          if (busy) return;
          setSelected(k);
          setSidebarOpen(false);
        }}
      />
      {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)} />}
      <main className="chat">
        <header className="chat-head">
          <button className="ghost menu" onClick={() => setSidebarOpen((o) => !o)} aria-label="Show experts">
            ☰
          </button>
          {current ? (
            <div className="head-text">
              <div className="head-title">
                {current.firstName} · {current.title} <ModelBadge tier={current.tier} />
              </div>
              <div className="head-sub">
                <strong>Voice:</strong> {current.voice} <strong>Style:</strong> {current.style}
              </div>
            </div>
          ) : (
            <div className="head-text">
              <div className="head-title">
                Ask the whole team <ModelBadge tier={lead?.tier ?? "opus"} />
              </div>
              <div className="head-sub">
                {lead?.firstName ?? "The Program Lead"} chooses the experts, runs compliance review on any drafts, and returns one combined answer.
              </div>
            </div>
          )}
        </header>

        {!config.apiKeyConfigured && (
          <div className="banner warn">
            ANTHROPIC_API_KEY is not set on the server. Add it in Netlify (Site configuration, Environment variables) and redeploy.
          </div>
        )}
        <div className="banner">
          <strong>Drafts only.</strong> The experts research and draft; this app never sends, posts, publishes, or buys anything.
          Review every draft, get compliance sign-off, and send it yourself.
        </div>

        <div className="messages">
          {items.length === 0 && (
            <div className="empty">
              {current ? (
                <>
                  <p>
                    Ask {current.firstName} anything about {current.title.toLowerCase()}.
                  </p>
                  <p className="muted small-text">{current.description}</p>
                  {current.knowledgeFiles.length > 1 && (
                    <p className="muted small-text">Knowledge files: {current.knowledgeFiles.filter((f) => !f.endsWith("README.md")).join(", ")}</p>
                  )}
                </>
              ) : (
                <>
                  <p>Try one of these:</p>
                  <div className="starters">
                    {STARTERS_TEAM.map((s) => (
                      <button key={s} className="starter" onClick={() => send(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {items.map((m) => (
            <Message key={m.id} item={m} />
          ))}
          <div ref={endRef} />
        </div>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={input}
            placeholder={current ? `Message ${current.firstName}…` : "Ask the whole team…"}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
          />
          {busy ? (
            <button type="button" className="secondary" onClick={() => abortRef.current?.abort()}>
              Stop
            </button>
          ) : (
            <button type="submit" className="primary" disabled={!input.trim()}>
              Ask
            </button>
          )}
        </form>
        <p className="foot muted">
          Not legal, tax, insurance, or lending advice. Do not enter real client names or personal details.
        </p>
      </main>
    </div>
  );
}
