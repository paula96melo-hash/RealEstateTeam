---
name: mls-market-data-analysis
description: "Interpret BeachesMLS and public housing data for West Palm Beach and Palm Beach County: median price, days on market, months of supply, list-to-sale ratio, split by single-family vs. condo and by ZIP. Use for market reports and pricing context."
---

# MLS & market data analysis

**Core metrics** (always split single-family vs. condo/townhouse, and by ZIP when possible):
median sale price · closed sales · new listings · active inventory · months of supply (active ÷ avg monthly closed) · median DOM · list-to-sale ratio · % sold under list · price reductions.

**Interpretation guide**
- Months of supply: < 4 seller's market · 4–6 balanced · > 6 buyer's market (PBC condos ~8.5 in Oct 2026).
- Small samples (e.g., 33405, Town of Palm Beach) swing wildly — report count with the median and avoid % changes on n < 20.
- Rising price + rising DOM (WPB SF Sep 2026) = sellers getting price but waiting; advise pricing precision.
- Condos: segment by building status (milestone/SIRS done vs. pending assessment) — medians hide the split.

**Data sources** (in order of preference): BeachesMLS (via the agent's login — the human pulls it), Realtors® association reports, Freddie Mac PMMS for rates, Census for population. Brokerage data pages (PBP Real Estate, Momentum, Echo) are 🟡.

**Baseline (Nov 2026, docs/01):** WPB SF median ~$625k (Sep), condo ~$210k; PBC SF ~$700k, condo ~$310k; 30-yr rate 7.28%; PBC closed sales −8% YoY.

**Output:** a table with metric, value, prior period, YoY, source, date; then 3 plain-language takeaways and what they mean for buyers vs. sellers. You cannot log into the MLS — list the exact pulls the human should run.
