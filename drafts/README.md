# drafts/

The only folder team agents can write to (the meta agent can also write agent and skill files). A hook enforces this. Everything here is a **draft**: nothing is sent, posted, published, or bought until a human approves it and does it themselves.

| Folder | What goes there | Written by |
|---|---|---|
| `approval-queue/` | Outward-facing items awaiting compliance review and **human approval** (posts, emails, texts, ads, flyers, scripts, event plans) | All specialists; `compliance-reviewer` adds review notes |
| `answers/` | Full combined answers from the Program Lead | `program-lead` |
| `regulatory-updates/` | Dated notes on rule or law changes, with proposed checklist updates | `regulatory-watch`, `consent-privacy-advisor` |
| `decision-log.md` | Morgan's recommendations: what was decided, why, which experts disagreed and the tie-breaker, and what the realtor must approve. Tracked in git as a template; check for personal data before committing entries | `program-lead` |
| `team-changes/` | Change notes for new or improved agents and skills, plus proposed edits to `CLAUDE.md` and `docs/expert-roster.md` | `team-architect` |

Contents are **gitignored** (except this file and `decision-log.md`) because drafts can contain contact details or unapproved copy. To keep an approved, contact-free deliverable, move it into `docs/` and commit it on purpose.

Approval queue status flow: `PENDING COMPLIANCE REVIEW` → `PENDING HUMAN APPROVAL` (or `REVISE`) → the human ticks **Approved** and sends or publishes it themselves.
