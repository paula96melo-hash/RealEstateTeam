---
name: improve-team
description: "Ask the team architect to create a new expert agent or skill, or improve an existing one, within the team's guardrails. Use when you want to add, change, or fix team agents or skills."
argument-hint: [your question or request]
disable-model-invocation: true
context: fork
agent: team-architect
background: false
---

Team change request:

$ARGUMENTS

As the team architect, follow the agent-skill-authoring process: read the roster and existing agents and skills, make the smallest change that satisfies the request, keep every guardrail (explicit read-only/draft-only tools, guard hooks, team-operating-rules preloaded), wire skills into the agents that need them, and write a change note in drafts/team-changes/ listing the edits the human should make to docs/expert-roster.md and CLAUDE.md. Summarize what you changed and how to review it with git diff.
