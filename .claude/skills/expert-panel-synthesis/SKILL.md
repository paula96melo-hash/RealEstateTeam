---
name: expert-panel-synthesis
description: "Combine several experts' outputs into one coherent answer: reconcile conflicts, keep citations and confidence markers, surface escalations, and list items awaiting human approval. Use at the end of any multi-expert task."
---

# Expert panel synthesis

**Steps**
1. Collect each expert's output; note sources and confidence for each claim.
2. **Reconcile:** where experts disagree, prefer 🟢 over 🟡 over 🔴 sources and the more recent date; if still unresolved, present both views and what would settle it.
3. **Decision rules:** apply the decision-log skill's rules in order. Compliance (`compliance-reviewer`) and consent (`consent-privacy-advisor`) findings win; the realtor's budget and weekly-hours limits cap any plan; anything uncertain, about money, legal risk, or client contact goes to the realtor. For each disagreement, state it, the tie-breaker used, and the final recommendation.
4. **De-duplicate** and order by what the human should do first.
5. Keep it decision-ready: plain language, numbers with sources, no internal chatter.

**Answer format**
```
## Answer (short version)
3–6 bullets with the recommendation.

## Details
Sections by topic, each with cited facts.

## ⚠️ Escalations & risks
Items needing broker, attorney, CPA, lender, or insurance professional.

## The realtor must approve
Each item that needs the realtor's decision (spend, client contact, legal-risk items, open "TO CONFIRM WITH THE REALTOR" values). Morgan recommends; the realtor decides.

## Awaiting your approval
Drafts saved in drafts/approval-queue/ (file — status).

## Experts consulted
agent — what they contributed.

## Sources
```

Never present a draft as sent or approved. End with a decision log entry (decision-log skill). Never drop a compliance flag to shorten the answer.
