---
name: data-privacy-security-hygiene
description: "Apply privacy and security practices: minimize personal data, protect consent records, never expose contact details to external services, follow wire-fraud protocols, and require MFA and access controls in tool specs. Use whenever handling contact data, client information, or tool setup."
---

# Data privacy & security hygiene

**Data minimization:** collect only what a task needs; drafts use placeholders (`[First Name]`) instead of real contact data; never paste client names, phones, emails, addresses, or financial details into WebSearch, WebFetch URLs, or any external service.

**Storage:** drafts with personal data stay in `drafts/` (gitignored by default) — never commit them; recommend the CRM as the system of record.

**Consent records:** treat as legal evidence — never edit, infer, or bulk-change.

**Wire fraud (top real estate cyber risk):** every client transaction plan includes a written wire-fraud warning at contract; wiring instructions are verified by phone using a known title-company number; never send or relay wire instructions by email or text; treat any "changed instructions" message as fraud until verified. AI voice/video impersonation is rising — verify out of band.

**Tool specs (for marketing-ops-architect):** MFA on email, CRM, ad and social accounts; least-privilege access; shared logins prohibited; regular contact export/backup; offboarding checklist; vendor privacy terms reviewed.

**Incidents:** suspected breach, phishing, or exposed data → stop and escalate to the human immediately with what is known.
