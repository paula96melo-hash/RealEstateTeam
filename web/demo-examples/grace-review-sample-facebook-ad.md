---
id: grace-review-sample-facebook-ad
agent: compliance-reviewer
title: Fair housing and compliance review of a sample Facebook ad
question: Review this sample Facebook ad and its targeting for fair housing and advertising compliance before it goes to the human, and give me a compliant rewrite.
keywords: [review, ad, ads, facebook, meta, fair, housing, compliance, targeting, family, families, safe, schools, church, rewrite, frec, brokerage, compliant, check]
made: 2026-11-26, Grace (compliance-reviewer agent, opus) in Claude Code
input: |
  SAMPLE - FICTIONAL ad. Headline: "Perfect Family Home in a Safe, Quiet Neighborhood!" Body: "Just listed! 3BR/2BA pool home in West Palm Beach (fictional address 789 Example Palm Lane). Ideal for young families — top-rated schools and walking distance to St. Mark's Church. Great for empty nesters too! #1 agent in Palm Beach County. Investors need not apply. Call Jamie Placeholder today!" Targeting plan: women 28–45 with children, ZIP codes 33401 and 33405 only, interests: parenting, church groups. No brokerage name shown.
---

## Compliance Review: SAMPLE (fictional) Facebook ad, "Perfect Family Home"
**Reviewer:** Grace (compliance-reviewer). **Date:** 2026-11-26. **Overall verdict: REVISE.** Nothing needs escalating: every issue has a clear fix.

Knowledge folder `knowledge/compliance-reviewer/` holds only its README, so there are no knowledge files yet. I reviewed against `docs/05` §2, §3 and the §8 checklist.

| # | Issue (quoted) | Rule | Verdict | Fix |
|---|---|---|---|---|
| 1 | "Perfect Family Home" / "Ideal for young families" | Familial status: FHA 42 U.S.C. 3604(c), Fla. Stat. 760.23(3); age: PBC ordinance (docs/05 §3) | REVISE | Describe the property ("3BR/2BA pool home") |
| 2 | "Safe, Quiet Neighborhood" | Safety characterization; "safe neighborhood" is on the avoid list (docs/05 §3) | REVISE | Delete it. Give specific property facts instead |
| 3 | "top-rated schools" | Schools must not be characterized (docs/05 §3) | REVISE | "School assignment: see SDPBC boundary locator" |
| 4 | "walking distance to St. Mark's Church" | Religious preference as a selling point (docs/05 §3) | REVISE | Delete it, or name general amenities only |
| 5 | "Great for empty nesters too!" | Age and familial status proxy (PBC ordinance; team-operating-rules #3) | REVISE | Delete it |
| 6 | "#1 agent in Palm Beach County" | Unsubstantiated superlative: FREC 61J2-10.025, Fla. Stat. 475.42 (docs/05 §2) | REVISE | Delete it |
| 7 | "Investors need not apply" | Investors are not a protected class, but this is an exclusionary limitation and may conflict with the seller's instructions | REVISE | Delete it. Any buyer restriction must come from the seller in writing and be reviewed by the broker |
| 8 | No brokerage name | 61J2-10.025: the brokerage name must appear in every ad (docs/05 §2) | REVISE | Add "[Brokerage Name]" |
| 9 | No Equal Housing Opportunity statement | docs/05 §3, §8 item 5 | REVISE | Add the EHO statement or logo |
| 10 | "Just listed!" | §8 item 8: listing permission | REVISE | Confirm the agent's own listing, or get the listing broker's permission and add attribution |
| 11 | Targeting: "Women 28–45 with children" | Sex, age, familial status; Meta Special Ad Category: Housing (docs/05 §3) | REVISE | Remove all demographic targeting |
| 12 | "ZIP codes 33401 and 33405 only" | The housing category blocks ZIP targeting (docs/05 §3) | REVISE | Radius around West Palm Beach at Meta's minimum |
| 13 | Interests: "parenting, church groups" | Proxies for familial status and religion | REVISE | Remove them. Use a broad audience |
| 14 | Agent named "Jamie Placeholder" | 61J2-10.025: licensee identifiable | PASS (conditional) | The agent is named. Passes once the brokerage name is added (#8) and the name matches the license |

### Compliant rewrite (whole ad)
**Headline:** Just Listed: 3BR/2BA Pool Home in West Palm Beach

**Body:** 3 bedrooms, 2 baths and a private pool at 789 Example Palm Lane, West Palm Beach (fictional). [Add verified facts, e.g., square footage, lot size, year built, garage, distance to a named park.] School assignment: see the School District of Palm Beach County boundary locator. Call Jamie Placeholder, [Brokerage Name], to schedule a showing. Equal Housing Opportunity.

**Targeting plan:** Special Ad Category: Housing (US) declared. Location: radius around West Palm Beach at Meta's minimum. No age, gender, ZIP, or interest targeting. Broad audience, or only the Advantage+ settings the category permits. No lookalike or exclusion audiences.

**Before publishing:** confirm listing permission, the photo/IDX rights and disclosure of any staging or AI-edited images (§8 items 8–9), REALTOR® usage if added (item 7), and broker pre-approval if brokerage policy requires it (item 13).

**Queue status:** REVISE. The rewrite above is the revised draft. Once the originating agent applies it, it can move to PENDING HUMAN APPROVAL. A PASS means only "ready for human approval", never approval to send.

**Sources**
- `docs/05-compliance-advertising-fair-housing.md` §2, §3, §8 (as of Nov 2026, 🟢)
- [Fla. Admin. Code R. 61J2-10.025](https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-Ann-R-61J2-10-025) 🟢
- [Fla. Stat. 760.23](https://m.flsenate.gov/Statutes/760.23) 🟢
- [PBC Fair Housing brochure](https://PBCGOV.ORG/equalopportunity/pdf/brochures/fair_housing.pdf) 🟢
- [Meta Special Ad Categories](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category) 🟢 (exact minimum radius not stated here: verify in Ads Manager)

**Escalations:** none. Item 7 goes to the broker only if a seller actually asks to restrict buyers.

**Needs human approval:** yes, after revision.
