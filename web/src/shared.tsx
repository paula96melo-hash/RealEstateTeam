// Shared UI pieces used by both live mode (App.tsx) and demo mode (Demo.tsx).
import { useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import teamJson from "./generated/team.json";

export interface Agent {
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

export const TEAM: Agent[] = teamJson as Agent[];
export const BY_NAME = new Map(TEAM.map((a) => [a.name, a]));
export const TEAM_KEY = "__team__";
export const LEAD = "program-lead";

export const who = (name?: string) => {
  const a = name ? BY_NAME.get(name) : undefined;
  return a ? `${a.firstName} · ${a.title}` : name ?? "";
};

export function ModelBadge({ tier }: { tier: string }) {
  return <span className={`badge badge-${tier}`}>{tier}</span>;
}

export function Markdown({ text }: { text: string }) {
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

export function CopyButton({ text, label = "Copy draft" }: { text: string; label?: string }) {
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
      {copied ? "Copied" : label}
    </button>
  );
}

// ---------- sidebar ----------
export function Sidebar({
  selected,
  onSelect,
  open,
  extra,
  teamLabel = "Ask the whole team",
}: {
  selected: string;
  onSelect: (key: string) => void;
  open: boolean;
  extra?: ReactNode;
  teamLabel?: string;
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
        <span className="team-title">{teamLabel}</span>
        <span className="team-sub">
          {lead?.firstName ?? "Program Lead"} picks the experts and returns one answer
        </span>
      </button>
      {extra}
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

