---
id: morgan-first-30-days-step3-ollie
agent: crm-follow-up-manager
partOf: morgan-first-30-days-team
order: 3
title: "Team step: minimum CRM and follow-up setup for the first 30 days"
question: "Morgan asks: a newly licensed West Palm Beach agent with ~8 hours/week is starting lead generation this month. What minimum CRM and follow-up setup do they need in the first 30 days?"
keywords: [crm, setup, stages, tags, consent, records, speed, lead, weekly, review, pipeline]
made: 2026-11-26, Ollie (crm-follow-up-manager agent, sonnet) in Claude Code, as part of Morgan's team answer
---

**Minimum 30-day CRM and follow-up setup (about 8 hrs/week, sample/demo only)**

No knowledge files yet in `knowledge/crm-follow-up-manager/` (README only). Based on `docs/07-crm-and-follow-up.md` §2–§7 (🟡 research snapshot, Nov 24, 2026; vendor-sourced, no independent benchmarks).

**Week 1: build (about 3 hrs)**
- Use the brokerage CRM if it has texting and drips. Otherwise use Follow Up Boss plus a simple IDX site (§1; prices unverified).
- Stages: New, Attempted, Contacted, Nurture A (0–3 mo) / B (3–6 mo) / C (6–12+ mo), Appointment Set, Agreement Signed, Active, Under Contract, Closed, Past Client. A buyer agreement must be signed before any tour.
- Tags, needs-based only: lead source and sub-source (for example "Open House – [Address] – [Date]"), segment (B1–B7 or S1–S7), target ZIPs, price band, property type, timeline, financing status. Never tag protected traits or proxies.

**Consent records**
- Per contact, log the consent type, timestamp, source, form version, and the federal, Florida, and internal DNC flags.
- Keep the consent checkbox unchecked by default.
- Never infer consent from a portal lead.
- Auto-suppress STOP, quit, cancel, unsubscribe, end, revoke, and opt out.

**Speed-to-lead rule**
- Respond to a new consented lead within 5 minutes by call. Text only if consent covers texting.
- Make a second attempt on day 1.
- On days 2–7, touch daily, alternating channels. Make at most 3 calls per 24 hours, between 8am and 8pm.
- On days 8–30, send 2–3 value touches per week. After day 30, move the lead to nurture.

**Weekly review (30–45 min, fixed slot)**
1. Was every new lead contacted?
2. Does every A lead have a next task?
3. Are overdue tasks cleared, and stale leads re-tiered?
4. Which sources produced appointments?
5. Run a contact export or backup.

**Escalations:** Consent, DNC, and text/call wording go to consent-privacy-advisor. Final legal confirmation goes to the supervising broker.
