# Demo examples

Saved answers the web app shows in **demo mode** (when no `ANTHROPIC_API_KEY` is set). Each one was produced by the real team agents in Claude Code on the date shown, from **fictional sample inputs only**. This repo is public, so there is no real client, lead, or MLS data here.

One Markdown file per example, with YAML frontmatter:

| Field | Meaning |
|---|---|
| `id` | Unique id (kebab-case) |
| `agent` | The agent's name from `.claude/agents/` (for example `condo-due-diligence-specialist`) |
| `title` | Short title shown in the app |
| `question` | The question the agent was asked |
| `keywords` | Words that help match a typed question to this example |
| `made` | When and how the answer was produced |
| `input` | The fictional sample input the agent used, if any |
| `team` | `true` for the combined "Ask the whole team" answer |
| `partOf` / `order` | For expert contributions shown inside a team example |

The build step (`web/scripts/build-team.mjs`) reads these files and fails if an example names an unknown agent. To add an example: run the agent in Claude Code with sample data, paste its answer under the frontmatter, and rebuild.
