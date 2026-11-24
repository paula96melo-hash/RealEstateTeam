---
name: tool-integration-specification
description: "Specify (never execute) how lead forms, the IDX website, CRM, ad platforms, email, and analytics connect, including consent fields, lead-source tagging, suppression sync, and data export. Use when designing or fixing the marketing tech stack."
---

# Tool integration specification

**Reference stack (docs/07):** brokerage-provided CRM if it has texting, drips, and portal integrations; otherwise Follow Up Boss + an IDX website. Alternatives: Lofty, BoldTrail (kvCORE), Sierra Interactive. Prices change — verify.

**Spec format:**
| Source | Destination | Trigger | Fields mapped | Consent fields | Tag/lead source | Suppression sync | Owner |

**Must-haves:**
- Every form passes consent fields (checkbox value, timestamp, form version, page URL, IP if available) into the CRM.
- Lead-source and sub-source tags on every entry point (open house QR, IG link-in-bio, YouTube description, Meta lead form, website).
- STOP/unsubscribe and DNC flags sync across CRM, SMS tool, and email tool.
- Meta lead forms set to Special Ad Category: Housing; privacy policy link.
- Portal leads (Zillow, Realtor.com) routed to CRM with instant notification for ≤ 5-min response.
- Analytics: UTM conventions; conversion = appointment set, not just lead.
- Weekly contact export/backup; data portable if the agent changes brokerages.

**Rules:** you write specs and checklists only — the human configures tools, connects accounts, and grants access. No API keys or credentials in drafts. Include MFA and access requirements (data-privacy-security-hygiene).
