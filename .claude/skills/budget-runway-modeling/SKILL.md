---
name: budget-runway-modeling
description: "Model a new agent's monthly costs, commission splits and fees, cash runway, marketing spend caps, and cost per closing, with what-if scenarios for rates and transaction volume. Use for spending decisions and financial planning."
---

# Budget & runway modeling

**Inputs (human supplies actuals; use placeholders otherwise):** personal monthly expenses · savings · brokerage split, cap, monthly/desk/tech/E&O fees · association + MLS dues · license/education costs (45-hr post-licensing) · marketing budget · expected average price and commission rate · referral/pay-at-close fees by channel.

**Core formulas:**
- Net commission per closing = price × commission % × (1 − referral fee %) × your split − per-transaction fees
- Runway (months) = savings ÷ (personal + business monthly burn − expected monthly net income)
- Cost per closing (by channel) = channel spend ÷ closings
- Break-even closings/yr = annual costs ÷ net commission per closing

**Context (docs/08):** median Realtor gross income ~$59,200 (2025, NAR 🟢); first closing often 3–6+ months; commissions paid at closing; post-settlement buyer compensation is negotiated. Risk #1 is running out of cash.

**Scenarios:** base / slow (rates stay > 7%, volume −10%) / good. Show months of runway in each.
**Guardrails:** recommend a monthly marketing cap; flag any spend without a measurable test; never commit, purchase, or sign up for anything — recommend only. Not tax or financial advice; suggest a CPA for taxes (quarterly estimates, deductions).

**Output:** assumptions table, monthly budget, runway by scenario, spend caps, warnings.
