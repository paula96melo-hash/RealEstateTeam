# Knowledge folders

Each agent has its own folder, `knowledge/<agent-name>/`, which it reads before every answer. Use these folders for documents that make an expert better at its job: templates, checklists, policies, sample data, and notes. Shared research stays in `docs/`.

> ⚠️ **This repository is public.** Put only **sample, synthetic, or anonymized** data here. Never add real client or lead names, phone numbers, emails, addresses, transaction details, consent records, MLS logins, passwords, API keys, or any other credentials. If a document has personal data, redact it first or keep it out of the repo.

| Folder | Agent |
|---|---|
| [`program-lead/`](program-lead/README.md) | Morgan, program-lead |
| [`market-analyst/`](market-analyst/README.md) | Dana, market-analyst |
| [`segmentation-strategist/`](segmentation-strategist/README.md) | Priya, segmentation-strategist |
| [`competitive-positioning-strategist/`](competitive-positioning-strategist/README.md) | Marcus, competitive-positioning-strategist |
| [`condo-due-diligence-specialist/`](condo-due-diligence-specialist/README.md) | Elena, condo-due-diligence-specialist |
| [`housing-finance-advisor/`](housing-finance-advisor/README.md) | Raymond, housing-finance-advisor |
| [`lead-generation-researcher/`](lead-generation-researcher/README.md) | Jordan, lead-generation-researcher |
| [`content-outreach-writer/`](content-outreach-writer/README.md) | Sofia, content-outreach-writer |
| [`social-media-manager/`](social-media-manager/README.md) | Tasha, social-media-manager |
| [`video-youtube-producer/`](video-youtube-producer/README.md) | Leo, video-youtube-producer |
| [`seo-website-specialist/`](seo-website-specialist/README.md) | Nina, seo-website-specialist |
| [`paid-ads-specialist/`](paid-ads-specialist/README.md) | Victor, paid-ads-specialist |
| [`events-scout/`](events-scout/README.md) | Gabe, events-scout |
| [`partner-network-builder/`](partner-network-builder/README.md) | Maya, partner-network-builder |
| [`crm-follow-up-manager/`](crm-follow-up-manager/README.md) | Ollie, crm-follow-up-manager |
| [`marketing-ops-architect/`](marketing-ops-architect/README.md) | Kenji, marketing-ops-architect |
| [`performance-analyst/`](performance-analyst/README.md) | Ruth, performance-analyst |
| [`budget-analyst/`](budget-analyst/README.md) | Walter, budget-analyst |
| [`compliance-reviewer/`](compliance-reviewer/README.md) | Grace, compliance-reviewer |
| [`consent-privacy-advisor/`](consent-privacy-advisor/README.md) | Ivy, consent-privacy-advisor |
| [`regulatory-watch/`](regulatory-watch/README.md) | Henry, regulatory-watch |
| [`team-architect/`](team-architect/README.md) | Quinn, team-architect |

Agents can read these folders but cannot write to them (agents write only to `drafts/`). To add knowledge, a human puts a file in the right folder and commits it after checking for personal data.
