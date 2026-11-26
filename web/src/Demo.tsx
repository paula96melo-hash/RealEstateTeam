// DEMO MODE: shown when the server has no ANTHROPIC_API_KEY (or the server function can't be reached).
// It shows the full team and saved example answers that the real agents produced from fictional sample
// data (web/demo-examples/). No model is called, nothing is sent, and no API key is used.
import { useMemo, useState } from "react";
import demoJson from "./generated/demo-examples.json";
import { BY_NAME, CopyButton, LEAD, Markdown, ModelBadge, Sidebar, TEAM, TEAM_KEY, who, type Agent } from "./shared";

export interface DemoExample {
  id: string;
  agent: string;
  title: string;
  question: string;
  keywords: string[];
  made: string;
  input: string;
  team: boolean;
  partOf: string | null;
  order: number;
  answer: string;
}

export const DEMO_BANNER =
  "Demo mode: these are saved example answers, not live AI. Live answers turn on when an API key is added.";

const EXAMPLES: DemoExample[] = demoJson as DemoExample[];
const ROSTER_KEY = "__roster__";

const STOP = new Set(
  "a an and are as at be by can could do does for from had has have how i if in into is it its me my of on or our should so that the their them then there these they this to too us was we what when where which who why will with would you your about any some just get".split(
    " ",
  ),
);
const tokens = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9$\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length > 1 && !STOP.has(w)),
  );

/** Best saved example for a typed question, or null when nothing is a reasonable match. */
export function findExample(question: string, pool: DemoExample[]): DemoExample | null {
  const q = tokens(question);
  if (!q.size) return null;
  let best: { ex: DemoExample; overlap: number; ratio: number } | null = null;
  for (const ex of pool) {
    if (ex.question.trim().toLowerCase() === question.trim().toLowerCase()) return ex;
    const keys = tokens(`${ex.question} ${ex.title} ${ex.keywords.join(" ")}`);
    let overlap = 0;
    q.forEach((w) => keys.has(w) && overlap++);
    const ratio = overlap / q.size;
    if (!best || overlap > best.overlap || (overlap === best.overlap && ratio > best.ratio)) best = { ex, overlap, ratio };
  }
  return best && best.overlap >= 2 && best.ratio >= 0.3 ? best.ex : null;
}

const examplesFor = (key: string) =>
  key === TEAM_KEY ? EXAMPLES.filter((e) => e.team) : EXAMPLES.filter((e) => e.agent === key && !e.team);
const stepsOf = (ex: DemoExample) => EXAMPLES.filter((e) => e.partOf === ex.id).sort((a, b) => a.order - b.order);
const topLevel = EXAMPLES.filter((e) => !e.partOf);

// ---------- pieces ----------
function ExampleAnswer({ ex }: { ex: DemoExample }) {
  const agent = BY_NAME.get(ex.agent);
  const steps = ex.team ? stepsOf(ex) : [];
  return (
    <div className="msg assistant">
      <div className="msg-head">
        <span className={`avatar c-${agent?.color ?? "gray"}`}>{agent?.firstName[0] ?? "?"}</span>
        <span className="msg-who">{who(ex.agent)}</span>
        {agent && <ModelBadge tier={agent.tier} />}
        <span className="example-tag">Example answer</span>
      </div>
      <p className="muted small-text example-meta">
        Saved example, not live AI. {ex.made && <>Made {ex.made}. </>}Sample data only.
      </p>
      {ex.input && (
        <details className="step">
          <summary>
            <span className="step-name">Fictional sample input the agent was given</span>
          </summary>
          <p className="brief">{ex.input}</p>
        </details>
      )}
      {steps.length > 0 && (
        <div className="steps">
          <p className="muted framing">
            {BY_NAME.get(LEAD)?.firstName ?? "The Program Lead"} split the question across {steps.length} experts, then combined their answers:
          </p>
          {steps.map((s) => (
            <details key={s.id} className="step">
              <summary>
                <span className={`avatar tiny c-${BY_NAME.get(s.agent)?.color ?? "gray"}`}>{BY_NAME.get(s.agent)?.firstName[0]}</span>
                <span className="step-name">{who(s.agent)}</span>
                <span className="status">Example step</span>
              </summary>
              <p className="brief">
                <strong>Brief:</strong> {s.question}
              </p>
              <Markdown text={s.answer} />
            </details>
          ))}
        </div>
      )}
      <div className="bubble draft">
        <div className="draft-label">EXAMPLE ANSWER · DRAFT ONLY, NOTHING IS SENT</div>
        <Markdown text={ex.answer} />
        <div className="msg-actions">
          <CopyButton text={ex.answer} label="Copy text" />
        </div>
      </div>
    </div>
  );
}

function ExampleList({ items, onPick, heading }: { items: DemoExample[]; onPick: (ex: DemoExample) => void; heading?: string }) {
  return (
    <div className="example-list">
      {heading && <p className="muted small-text">{heading}</p>}
      {items.map((ex) => (
        <button key={ex.id} className="starter" onClick={() => onPick(ex)}>
          <span className="starter-who">
            {ex.team ? "Ask the whole team" : who(ex.agent)}
          </span>
          <span>{ex.title}</span>
        </button>
      ))}
    </div>
  );
}

function Roster({ onPick }: { onPick: (name: string) => void }) {
  return (
    <div className="roster">
      <h2>Meet the team ({TEAM.length} agents)</h2>
      <p className="muted small-text">
        Each agent has a role, a persona, and a model (its "brain"): opus for deep strategy, legal and finance judgment; sonnet for most
        specialist work; haiku for fast, simple lookups. Click any agent to see its saved examples.
      </p>
      <div className="table-wrap">
        <table className="roster-table">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Role</th>
              <th>Persona</th>
              <th>Model</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map((a: Agent) => {
              const n = examplesFor(a.name).length + (a.name === LEAD ? examplesFor(TEAM_KEY).length : 0);
              return (
                <tr key={a.name} onClick={() => onPick(a.name)}>
                  <td>
                    <span className="roster-name">
                      <span className={`avatar tiny c-${a.color}`}>{a.firstName[0]}</span>
                      {a.firstName}
                    </span>
                  </td>
                  <td>
                    {a.title}
                    <div className="muted small-text">{a.group}</div>
                  </td>
                  <td>
                    <div>{a.voice}</div>
                    <div className="muted small-text">{a.style}</div>
                  </td>
                  <td>
                    <ModelBadge tier={a.tier} />
                  </td>
                  <td>{n || "–"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- page ----------
type Result = { kind: "example"; ex: DemoExample; asked: string } | { kind: "nomatch"; asked: string } | null;

export default function DemoApp({ reason }: { reason: "no-key" | "unreachable" }) {
  const [selected, setSelected] = useState<string>(ROSTER_KEY);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pool = useMemo(() => (selected === ROSTER_KEY ? [] : examplesFor(selected)), [selected]);
  const current = selected === ROSTER_KEY || selected === TEAM_KEY ? null : BY_NAME.get(selected);
  const lead = BY_NAME.get(LEAD);

  const select = (key: string) => {
    setSelected(key);
    setResult(null);
    setInput("");
    setSidebarOpen(false);
  };
  const show = (ex: DemoExample) => {
    const key = ex.team ? TEAM_KEY : ex.agent;
    setSelected(key);
    setInput(ex.question);
    setResult({ kind: "example", ex, asked: ex.question });
    setSidebarOpen(false);
  };
  const ask = () => {
    const q = input.trim();
    if (!q) return;
    const ex = findExample(q, pool);
    setResult(ex ? { kind: "example", ex, asked: q } : { kind: "nomatch", asked: q });
  };

  return (
    <div className="layout">
      <Sidebar
        selected={selected}
        onSelect={select}
        open={sidebarOpen}
        teamLabel="Ask the whole team (examples)"
        extra={
          <button className={`team-button roster-button ${selected === ROSTER_KEY ? "active" : ""}`} onClick={() => select(ROSTER_KEY)}>
            <span className="team-title">Meet the team</span>
            <span className="team-sub">All {TEAM.length} agents with role, persona, and model</span>
          </button>
        }
      />
      {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)} />}
      <main className="chat">
        <div className="banner demo-banner" role="status">
          <strong>{DEMO_BANNER}</strong>
          {reason === "unreachable" && <div className="small-text">The server function could not be reached, so the app is showing saved examples.</div>}
        </div>
        <header className="chat-head">
          <button className="ghost menu" onClick={() => setSidebarOpen((o) => !o)} aria-label="Show experts">
            ☰
          </button>
          {selected === ROSTER_KEY ? (
            <div className="head-text">
              <div className="head-title">Meet the team</div>
              <div className="head-sub">Pick an agent on the left, or "Ask the whole team", to see saved example answers.</div>
            </div>
          ) : current ? (
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
                In live mode, {lead?.firstName ?? "the Program Lead"} picks the experts and combines their answers. Here you can see a saved example of that.
              </div>
            </div>
          )}
        </header>

        <div className="messages">
          {selected === ROSTER_KEY ? (
            <Roster onPick={(name) => select(name)} />
          ) : (
            <>
              <div className="demo-picker">
                {pool.length > 0 ? (
                  <ExampleList
                    items={pool}
                    onPick={show}
                    heading={`Saved example questions for ${current ? current.firstName : "the whole team"}. Pick one, or type your own question below.`}
                  />
                ) : (
                  <>
                    <p>
                      No saved examples for {current?.firstName ?? "this agent"} yet. In live mode you could ask{" "}
                      {current?.firstName ?? "them"} anything. Here are the examples available:
                    </p>
                    <ExampleList items={topLevel} onPick={show} />
                  </>
                )}
              </div>

              {result?.kind === "example" && (
                <>
                  <div className="msg user">
                    <div className="bubble">{result.asked}</div>
                  </div>
                  <ExampleAnswer ex={result.ex} />
                </>
              )}
              {result?.kind === "nomatch" && (
                <>
                  <div className="msg user">
                    <div className="bubble">{result.asked}</div>
                  </div>
                  <div className="nomatch">
                    <p>
                      <strong>No saved example matches that question.</strong> Live answers aren't available in demo mode. These are the saved
                      examples you can open:
                    </p>
                    <ExampleList items={topLevel} onPick={show} />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {selected !== ROSTER_KEY && (
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
          >
            <textarea
              value={input}
              placeholder={current ? `Type a question for ${current.firstName}…` : "Type a question for the whole team…"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              rows={2}
            />
            <button type="submit" className="primary" disabled={!input.trim()}>
              Show example
            </button>
          </form>
        )}
        <p className="foot muted">Demo mode uses only fictional sample data. Not legal, tax, insurance, or lending advice.</p>
      </main>
    </div>
  );
}
