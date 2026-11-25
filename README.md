# RealEstateTeam

Lead-generation and marketing system for a newly licensed Realtor in West Palm Beach, Florida.

- [`docs/`](docs/README.md) — research context (market, segments, lead sources, competitors, compliance, social, CRM, risks) for the expert agent team.
- [`CLAUDE.md`](CLAUDE.md) — the expert agent team (22 Claude Code subagents, 35 skills): how to use it and its guardrails. Start with `/ask-the-team [question]`.
- [`web/`](web/README.md) — React web app for talking to the experts (sidebar of agents, chat, "Ask the whole team"), deployed on Netlify with the Claude API called only from a Netlify Function. Step-by-step deploy guide in `web/README.md`.
