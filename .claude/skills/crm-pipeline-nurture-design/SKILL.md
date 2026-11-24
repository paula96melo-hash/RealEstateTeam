---
name: crm-pipeline-nurture-design
description: "Design CRM stages, tags, A/B/C tiers, sphere touch plans, and automated drip logic with suppression rules for a solo Realtor. Use when setting up or improving the CRM and follow-up system."
---

# CRM pipeline & nurture design

**Stages:** New → Attempted → Contacted → Nurture (A 0–3 mo / B 3–6 mo / C 6–12+ mo) → Appointment Set → Buyer Agreement Signed / Listing Agreement Signed → Showing/Active → Under Contract → Closed → Past Client.
(Buyer agreement must be signed **before any tour** — NAR settlement practice.)

**Required fields (docs/07 §2):** contact info · consent records (type, timestamp, source, form version) · DNC flags (federal, Florida, internal) · language preference · lead source + sub-source · segment tags (B1–B7, S1–S7) · target ZIPs · price range · property type · timeline · financing status · key dates (closing anniversary, lease end, insurance renewal, Mar 1 homestead deadline).
**Never store:** protected-class attributes as tags or scoring inputs.

**Speed-to-lead:** respond ≤ 5 min (call; text only if consented); day 1 second attempt; days 2–7 daily alternating channels within FTSA limits; days 8–30 2–3×/week value touches; then drip.

**Nurture cadences:** A 2×/week personal · B weekly · C 2×/month automated + monthly personal · SOI 33 touches/year · Past clients monthly email, quarterly call, annual home-value review.

**Suppression rules:** STOP/unsubscribe → immediate suppression across channels; DNC → no calls/texts; bounced → email off; closed with another agent → move to C or archive.

**Deliverable:** pipeline spec + automation map (trigger → wait → action → exit condition). The human configures the CRM; automations that send messages require human sign-off of every template.
