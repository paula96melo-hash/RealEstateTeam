---
name: agent-skill-authoring
description: "Create new team agents and skills, or improve existing ones, following Claude Code subagent and skill file formats and this team's guardrails (explicit read-only/draft-only tool allowlists, guard hooks, shared skills). Use when the team needs a new expert, a new skill, or a fix to an existing one."
---

# Agent & skill authoring

**Agent file** — `.claude/agents/<kebab-name>.md`, frontmatter first line `---`:
```yaml
---
name: kebab-name                # unique, no colons
description: One sentence on when to delegate to this expert. Use for …
tools: Read, Grep, Glob, Skill, Write, Edit, WebSearch, WebFetch   # explicit single-line allowlist
model: sonnet                   # opus = deep strategy/legal/finance judgment; sonnet = most specialist work; haiku = fast simple lookups
color: blue                     # red blue green yellow purple orange pink cyan
skills:
  - team-operating-rules
  - research-library-navigation
  - approval-queue-submission
  - risk-flagging-escalation
  - <role skills…>              # ≤ 32 total
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: 'python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/guard_writes.py" drafts || exit 2'
---
```
Body = system prompt: "Your name is **[First name]**. You are the **[Role]**…", mission, rules recap, `## Your persona` (name, voice, working style; tone only), `## Your knowledge folder (read it first, every time)` pointing to `knowledge/<kebab-name>/`, sources, how you work, output format, handoffs. Give each new agent a first name not already used (see `docs/agent-brains.md`).

**Allowed tools only:** Read, Grep, Glob, Skill, Write, Edit (with the guard hook), WebSearch, WebFetch, TodoWrite. `Agent` only for an orchestrator with the `restrict_agent_spawn.py` hook. Forbidden: Bash, PowerShell, NotebookEdit, MCP tools, Artifact, SendMessage, any tool that sends, posts, publishes, buys, or schedules. Forbidden fields: permissionMode, mcpServers, memory, isolation. Never omit `tools:` (that inherits everything). The guard hook rejects violations.

**Skill file** — `.claude/skills/<kebab-name>/SKILL.md`:
```yaml
---
name: kebab-name
description: What it does and when to use it — key use case first, natural keywords, under ~1,000 characters, no angle brackets.
---
```
Body: concise, imperative, under 500 lines; supporting `.md` files allowed next to it. Not allowed: `allowed-tools`, `hooks`, `shell`, `!` command injection, scripts. Don't set `disable-model-invocation: true` on skills agents must preload.

**Process for any change**
1. Read `docs/expert-roster.md`, `CLAUDE.md`, and similar existing agents/skills; reuse skills before creating new ones.
2. Write or edit the files.
3. Wire skills into every agent that needs them (`skills:` list) and update `workflow-orchestration-handoffs` if a new expert should be routable.
4. New agents also need `knowledge/<kebab-name>/README.md` (what belongs there, plus the public-repo warning: sample or anonymized data only, never real client names or MLS logins). You cannot write to `knowledge/`, so put the full README text in your change note for the human to add, along with a new row for `docs/agent-brains.md`.
5. Write a change note in `drafts/team-changes/YYYY-MM-DD-<slug>.md`: what changed, why, which agents use the new or changed skill, and the exact edits needed in `docs/expert-roster.md` and `CLAUDE.md` (which you cannot edit — the human applies them).
6. The human reviews with `git diff` and commits.
