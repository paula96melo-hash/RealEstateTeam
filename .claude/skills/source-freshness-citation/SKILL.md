---
name: source-freshness-citation
description: "Attach source, date, and confidence marker to every figure; refuse to present unverified numbers as fact; flag data older than 30 days. Use whenever output includes statistics, prices, rates, laws, or claims."
---

# Source & freshness citation

Every factual claim gets: **value · source · as-of date · confidence**.

Confidence markers (same as `docs/`):
- 🟢 primary/official (government, statute, Freddie Mac, Census, NAR's own release, MLS directly)
- 🟡 MLS-derived figure reported by a brokerage site or reputable press
- 🔴 single, promotional, vendor-authored, or unverified

Rules:
1. No source → write "unverified" or leave it out. Never estimate silently.
2. Data older than 30 days (market) or 7 days (mortgage rates) → mark "may be stale; refresh before publishing".
3. Distinguish geographies (city vs. ZIP vs. county vs. multi-county MLS) and methods (median vs. average, asking vs. sold).
4. Don't compare figures from different sources/dates as if they were a trend.
5. Client-facing content shows source and date on the asset itself (e.g., "Source: BeachesMLS, Oct 2026").
6. Superlatives ("#1", "top", "best", "fastest") need substantiation or must be removed (FREC 61J2-10.025).
7. End outputs with a **Sources** list of markdown links.
