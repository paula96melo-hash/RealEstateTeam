# RealEstateTeam — Expert Agent Team

This project is a team of Claude Code subagents that advise a consultant building a **lead-generation and marketing system for a newly licensed Realtor in West Palm Beach, Florida**. The team researches, plans, and drafts. **It never contacts anyone; a human approves and sends everything.**

## Team rules (every agent, no exceptions)
1. **Draft only.** Agents never call, text, email, DM, post, comment, publish, submit forms, register, buy ads or leads, or contact any person or business. They have no tools for this.
2. **A human approves everything before it goes out.** The order is always: agent draft → `compliance-reviewer` (plus `consent-privacy-advisor` for calls, texts, email, or contact data) → human approval → the human sends or publishes it. A compliance pass never replaces human approval.
3. **No protected characteristics in targeting.** Agents never use race, color, religion, sex, national origin, familial status, disability, age, marital status, sexual orientation, or gender identity or expression, or proxies for them, to target, exclude, segment, score, or describe audiences or neighborhoods. Segments use housing need, price, property type, transaction situation, timeline, and geography of origin only.
4. Cite sources with dates and confidence markers (🟢/🟡/🔴), or say "unverified".
5. Escalate legal, tax, insurance, and lending questions to the broker or a licensed professional.
6. Never put client or contact personal details into web searches or URLs.
7. Every agent reads its own `knowledge/<agent-name>/` folder before answering. **This repo is public:** knowledge folders hold only sample, synthetic, or anonymized data, never real client names, contact details, MLS logins, or other credentials.

## How to use the team
| You want to… | Do this |
|---|---|
| Ask any project question and get one combined answer | `/ask-the-team [question]`, or ask Claude to "use the program-lead agent to …" |
| Run a whole session as the orchestrator | `claude --agent program-lead` (its spawn list is enforced most strictly in this mode) |
| Ask one expert directly | "Use the market-analyst agent to …" or `@market-analyst …` |
| Get a draft checked | "Have compliance-reviewer review drafts/approval-queue/[file]" |
| Add or improve an agent or skill | `/improve-team [request]`, or "use the team-architect agent to …" |
| Approve outgoing items | Open `drafts/approval-queue/`, read the reviewer notes, tick **Approved**, then send or publish it yourself |

Example prompts: [docs/how-to-talk-to-your-experts.md](docs/how-to-talk-to-your-experts.md).

**Web app:** [`web/`](web/README.md) is a React app (deployed on Netlify) with the same team: a sidebar of agents, a chat window, and "Ask the whole team". It reads the agents, skills, docs, and knowledge folders at build time, calls the Claude API only from a Netlify Function (`ANTHROPIC_API_KEY`, optional `APP_PASSWORD`), and only shows drafts. With no API key it runs in **demo mode**: saved example answers from `web/demo-examples/` (sample data only), clearly labelled, with no AI calls.

## The team (22 agents in `.claude/agents/`)
**Orchestrator:** `program-lead` takes any question, picks the experts, has them build on each other's work, sends drafts through compliance, and returns one answer. It can spawn only the 20 specialists below. It cannot spawn built-in agents or `team-architect`.

**Meta:** `team-architect` creates and improves agents and skills. It writes only to `.claude/agents/`, `.claude/skills/`, and `drafts/`, and a validator rejects any file that breaks the guardrails.

**Specialists (from [docs/expert-roster.md](docs/expert-roster.md)):**
| Domain | Agents |
|---|---|
| Business & strategy | `market-analyst`, `segmentation-strategist`, `competitive-positioning-strategist` |
| Business domain | `condo-due-diligence-specialist`, `housing-finance-advisor` |
| Marketing | `lead-generation-researcher`, `content-outreach-writer`, `social-media-manager`, `video-youtube-producer`, `seo-website-specialist`, `paid-ads-specialist`, `events-scout`, `partner-network-builder` |
| Operations & technical | `crm-follow-up-manager`, `marketing-ops-architect`, `performance-analyst` |
| Finance | `budget-analyst` |
| Legal & compliance | `compliance-reviewer` (gatekeeper), `consent-privacy-advisor`, `regulatory-watch` |

## Brains, personas, and knowledge
- Each agent's model is set in its `model:` field: `opus` for deep strategy, legal, compliance, and finance judgment (10 agents, including `program-lead`, `compliance-reviewer`, `budget-analyst`), `sonnet` for most specialist work (11), and `haiku` for fast, simple lookups (`events-scout`).
- Each agent has a first name, voice, and working style (e.g., Morgan the Program Lead, Grace the Compliance Reviewer). Personas set tone only and never override the rules.
- Full table with the reason for each choice: [docs/agent-brains.md](docs/agent-brains.md).
- Knowledge folders: [knowledge/README.md](knowledge/README.md). Agents read them but can't write to them; a human adds files after checking for personal data.

## Skills (35 in `.claude/skills/`)
- **Shared by every agent:** `team-operating-rules`, `research-library-navigation`, `approval-queue-submission`, `risk-flagging-escalation`.
- **The 30 roster skills** (S01–S30 in `docs/expert-roster.md` §3) are wired to the agents listed there through each agent's `skills:` frontmatter, which preloads them. Examples: `fair-housing-language-screen` (10 agents), `consent-dnc-verification`, `condo-document-interpretation`, `crm-pipeline-nurture-design`.
- **Orchestration and meta:** `workflow-orchestration-handoffs` (routing table), `expert-panel-synthesis`, `agent-skill-authoring`.
- **Entry points (user-invoked):** `/ask-the-team` (runs `program-lead`) and `/improve-team` (runs `team-architect`).

## Guardrails (how "read-only and draft-only" is enforced)
- Each agent has an explicit `tools:` allowlist drawn from: Read, Grep, Glob, Skill, WebSearch, WebFetch, and Write/Edit. Only `program-lead` has `Agent`.
- No agent has Bash, MCP connectors (Gmail, Calendar, GitHub, etc.), Artifact, SendMessage, or any other tool that can send, post, publish, buy, or schedule.
- `.claude/hooks/guard_writes.py` is a PreToolUse hook on every agent with Write/Edit. It blocks writes outside `drafts/`. For `team-architect` it also allows `.claude/agents/` and `.claude/skills/`, and validates every agent and skill file written there. It rejects forbidden tools, unknown models, a missing `tools:` line, removed or weakened hooks, `permissionMode`, `mcpServers`, `memory`, skill `allowed-tools`, `!` shell injection, and scripts.
- `.claude/hooks/restrict_agent_spawn.py` lets `program-lead` spawn only project experts.
- Hooks need `python3`. They fail closed: if Python is missing, the tool call is blocked. Frontmatter hooks run only after you accept the workspace trust dialog, so use the team in interactive sessions (hooks may not apply in `-p` headless runs).
- These limits apply to the team agents, not to your own main Claude session.

## Project layout
```
docs/                 Research (01–08), README index, expert-roster.md (roles + skill map)
.claude/agents/       22 subagents
.claude/skills/       35 skills (one folder each, SKILL.md)
.claude/hooks/        guard_writes.py, restrict_agent_spawn.py
knowledge/            One folder per agent, read before every answer (sample/anonymized data only)
web/                  React web app + Netlify Function (see web/README.md); netlify.toml at the repo root
drafts/               The only place agents write (gitignored except README)
  approval-queue/     Items awaiting compliance review and human approval
  answers/  regulatory-updates/  team-changes/
```

## Maintaining the team
- Research is a snapshot from **November 24, 2026**. Refresh market data monthly and rates weekly, and check "Known gaps" in `docs/README.md`.
- Add or change agents and skills through `team-architect`. Then review with `git diff .claude/`, apply its proposed `CLAUDE.md` and roster edits from `drafts/team-changes/`, and commit.
- Never commit `drafts/` contents that include contact details.
- This is research and drafting support, not legal advice. Compliance outputs should be confirmed by the supervising broker or a Florida real estate attorney.
