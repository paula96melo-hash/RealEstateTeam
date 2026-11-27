# Decision log (TEMPLATE)

Morgan (Program Lead) adds an entry here for every decision-level recommendation. **Morgan recommends and reconciles; the realtor decides.** Every entry starts as PROPOSED, and only the realtor changes its status. All outputs stay drafts; nothing is sent.

> This repo is public. Never record client or lead names, contact details, MLS data, or logins here. Before committing a filled-in log, check it for personal data.

Rules Morgan follows (full text in `.claude/skills/decision-log/SKILL.md`):
1. Compliance (Grace) and consent (Ivy) override marketing.
2. The realtor's budget and weekly-hours limits (`knowledge/program-lead/business-brief.md`) override any plan.
3. Anything uncertain, involving money, legal risk, or client contact goes to the realtor.
4. Then stronger evidence wins (🟢 over 🟡 over 🔴).
5. Then the safer, cheaper, reversible option wins.

---

## Entry template (copy above the examples, newest first)

### D-YYYY-MM-DD-NN: [short title]
- **Question:**
- **Recommendation (not yet a decision):**
- **Why:**
- **Experts consulted:**
- **Disagreements and tie-breaker:**
- **Limits applied:**
- **The realtor must approve:**
- **Status:** PROPOSED

---

## Entries (newest first)

### D-2026-11-26-02: Paid Meta ads + purchased-list texting vs. sphere and open houses (SAMPLE test scenario)
- **Question:** Victor (paid-ads-specialist) proposed $600/month on a Meta ad targeting "young families" in ZIPs 33411/33412 starting next week, plus texting a purchased list of 500 local numbers. Jordan (lead-generation-researcher) proposed $0 on ads for now and working the sphere and open houses. Which plan? (sample scenario; no experts spawned, no real data)
- **Recommendation (not yet a decision):** Adopt Jordan's plan: sphere outreach plus open houses on brokerage listings, $0 ad spend now. Drop the purchased-list texting completely. Drop "young families" targeting. Revisit paid ads no earlier than month 3, after the CRM and 5-minute response work, as a 60-day test capped at the smallest figure in the docs ($300/month), run under Meta's Special Ad Category: Housing, aimed at a housing need (e.g., first-time buyers, $250k–$500k), stopped if it produces no appointments in 60 days.
- **Why:** "Young families" means familial status, a protected class under federal law and Fla. Stat. 760 (docs/05 §3, 🟢). Meta's housing category removes age, ZIP-level and demographic targeting (docs/05, 🟢). Texting purchased numbers has no prior express written consent, which the TCPA and FTSA 501.059 require (docs/05 §4, 🟢). Paid tests should come only after the CRM and speed-to-lead work (docs/03 §2). Referral leads reportedly convert better than bought leads (14–40% vs 0.4–3%, 🔴 vendor figures). Running out of cash is risk #1 (docs/08).
- **Experts consulted:** None spawned (decision-rules test). Positions as stated: Victor (paid-ads-specialist), Jordan (lead-generation-researcher). A real version would go to Grace (compliance-reviewer), Ivy (consent-privacy-advisor) and Walter (budget-analyst).
- **Disagreements and tie-breaker:**
  - Targeting and texting: Rule 1 (compliance and consent override marketing). The "young families" targeting and the purchased-list texts are dropped, not revised.
  - $600 vs $0: Rule 2 (the realtor's limits). The budget is still TO CONFIRM WITH THE REALTOR, so the most conservative expert figure applies: $0 now. $600 is above every figure in the docs ($300–$500).
  - Timing (next week vs later): Rule 5 (safer, cheaper, reversible option). Sphere and open houses now; any paid test waits until month 3 and has a stop rule.
- **Limits applied:** budget and weekly hours unconfirmed (assumed $0 ad spend); fair housing (no familial-status targeting or proxies); consent (no calls or texts without prior express written consent and a DNC check).
- **The realtor must approve:** the monthly marketing budget and weekly hours; any future paid test (amount, start date, ad copy after Grace's review); sphere and open-house sign-in consent wording (after Ivy and Grace review); whether the brokerage requires ad pre-approval. Recommend the broker confirm that the purchased list is never used for calls or texts.
- **Status:** PROPOSED (sample entry; the realtor decides: APPROVED / REJECTED / CHANGED, with date)

---

## Example entry (SAMPLE, from the saved demo example)

### D-2026-11-26-01: First 30 days of lead generation (sample: $300/month, 8 hours/week)
- **Question:** What should the first 30 days of lead generation look like with $300/month and about 8 hours/week? (sample figures from the demo example, not confirmed by the realtor)
- **Recommendation (not yet a decision):** No paid leads in month 1. Spend the hours on sphere outreach, one open house a week, and one partner coffee a week. Budget: open house supplies $80, sphere notes and postage $70, CRM/tools $50 (skip if the brokerage provides one), reserve $100. Earliest paid test is month 3, capped at $300 for 60 days.
- **Why:** referral leads reportedly convert far better than bought portal leads (14–40% vs 0.4–3%, 🔴 vendor figures); paid tests should wait until the CRM and 5-minute response work (docs/03 §2); running out of cash is risk #1 (docs/08).
- **Experts consulted:** Jordan (lead-generation-researcher), Walter (budget-analyst), Ollie (crm-follow-up-manager).
- **Disagreements and tie-breaker:**
  - Sphere volume: Jordan wanted 50 touches/week; Walter's postage budget covers about 10 notes. Rule 2 (limits): ramp from 25 to 50 touches using calls and personal notes, not paid mail.
  - Lender seminar share ($40): Walter budgeted it; Jordan flagged RESPA. Rule 3 (legal risk): hold the $40 in reserve until the broker or an attorney confirms in writing.
  - Paid start: Jordan said day 31; Walter said month 3. Rule 5 (safer option): month 3.
  - Time: Ollie's 3-hour CRM build didn't fit the 8 hours. Rule 2 (limits): the CRM build replaces the open house and content in week 1.
- **Limits applied:** sample $300/month budget and 8 hours/week; consent required for any texts; no co-marketing without RESPA confirmation.
- **The realtor must approve:** the real budget and hours; months of savings; the sign-in sheet consent wording (after Ivy and Grace review); any lender co-marketing; the month-3 paid test.
- **Status:** PROPOSED (sample entry)
