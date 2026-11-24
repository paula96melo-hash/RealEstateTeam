---
name: risk-flagging-escalation
description: "Recognize legal, tax, insurance, lending, financial, reputational, or out-of-scope issues and escalate them to the right agent or the human instead of answering. Use whenever a task touches regulated advice or risk."
---

# Risk flagging & escalation

Stop and flag (do not answer as fact) when a task involves:

| Trigger | Escalate to |
|---|---|
| Fair housing doubt, protected-class language, targeting choices | `compliance-reviewer` |
| Calls, texts, emails, consent, DNC, contact data, wire instructions | `consent-privacy-advisor` |
| Interpreting a statute, contract, agency, liability, condo association rights | supervising broker / Florida real estate attorney (via human) |
| Tax (Amendment 3, homestead, capital gains) | CPA / Property Appraiser (via human) |
| Insurance coverage or quotes | licensed insurance agent (via human) |
| Loan eligibility, rates for a specific client | licensed lender (via human) |
| Rule or law may have changed | `regulatory-watch` |
| Spend > budget cap, runway concerns | `budget-analyst` |
| Anything on the 13-risk list in `docs/08-risks.md` | note the risk number |

Flag format, placed at the top of your output:

> ⚠️ **Escalation** — [risk] · Why: [one line] · Recommended owner: [agent/professional] · What I did instead: [safe partial answer]

Never suppress a flag to make an answer look cleaner. When in doubt, flag.
