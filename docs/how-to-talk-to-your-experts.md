# How to Talk to Your Experts

A quick guide to asking the expert agent team questions in Claude Code. For the full team description and guardrails, see [`CLAUDE.md`](../CLAUDE.md). For each expert's role and skills, see the [expert roster](expert-roster.md).

**Before you start:** open this project in Claude Code (interactive session) and accept the "trust this folder" prompt. The safety checks only run after you do.

**Remember:** the team only researches and drafts. Anything meant to go out (posts, emails, texts, ads, invitations) lands in `drafts/approval-queue/` for you to review. Nothing is sent, posted, published, or bought until you do it yourself.

---

## 1. Ask the whole team a question

Any of these three ways sends your question to the **Program Lead**, the orchestrator. It decides which experts to bring in, has them work together, sends drafts through compliance, and returns one combined answer.

**Option A: the slash command (recommended)**
```text
/ask-the-team How should I split a $500/month marketing budget in my first six months?
```

**Option B: ask in plain language**
```text
Use the program-lead agent to figure out which neighborhoods I should focus on first and why.
```

**Option C: run a whole session as the orchestrator**
```bash
claude --agent program-lead
```
Every question you type in that session goes to the Program Lead. This mode also enforces its list of allowed experts most strictly.

---

## 2. Ask one specific expert a question

Use this when your question clearly belongs to one area and you don't need a combined answer.

**Mention the agent with @:**
```text
@market-analyst What's the current median sale price and months of supply for condos in 33401?
```

**Or name it in plain language:**
```text
Use the condo-due-diligence-specialist agent to explain what a structural integrity reserve study is, in plain English, for a first-time buyer.
```

More single-expert examples:
```text
@compliance-reviewer Review drafts/approval-queue/2026-12-01-content-outreach-writer-open-house-post.md
```
```text
@budget-analyst If my split is 70/30 with a $12,000 cap and I have $15,000 saved, how many months of runway do I have at $3,500/month in expenses? Use placeholders for anything I didn't give you.
```
```text
@regulatory-watch Has anything changed in Florida's telephone solicitation law since 2023?
```

**Agent names** (use these exactly):

| Area | Agents |
|---|---|
| Orchestrator | `program-lead` |
| Strategy & market | `market-analyst`, `segmentation-strategist`, `competitive-positioning-strategist` |
| Local expertise | `condo-due-diligence-specialist`, `housing-finance-advisor` |
| Marketing | `lead-generation-researcher`, `content-outreach-writer`, `social-media-manager`, `video-youtube-producer`, `seo-website-specialist`, `paid-ads-specialist`, `events-scout`, `partner-network-builder` |
| Operations & finance | `crm-follow-up-manager`, `marketing-ops-architect`, `performance-analyst`, `budget-analyst` |
| Legal & compliance | `compliance-reviewer`, `consent-privacy-advisor`, `regulatory-watch` |
| Team builder (meta) | `team-architect` (use `/improve-team` to add or change agents and skills) |

---

## 3. Example prompts that get several experts working together

Each prompt below is written to need several experts at once, so the Program Lead coordinates them into one answer. Paste any of them after `/ask-the-team`. The experts listed are the ones the orchestrator is likely to bring in; it makes the final choice.

### Example 1: Launch plan for my first 90 days
```text
/ask-the-team I'm newly licensed in West Palm Beach with $400/month for marketing and about 10 hours a week. Build me a 90-day lead-generation plan: which segments to focus on, which lead sources to use first, a weekly activity schedule, the KPIs to track, and whether my budget and runway can support it. Include draft copy for my "I'm now licensed" announcement email to my sphere.
```
**Likely experts:** `segmentation-strategist` → `lead-generation-researcher` → `budget-analyst` + `performance-analyst` → `content-outreach-writer` → `consent-privacy-advisor` (email to contacts) → `compliance-reviewer` (announcement copy).
**You get:** one plan with priorities, a schedule, KPIs, budget and runway check, and the announcement email waiting in `drafts/approval-queue/`.

### Example 2: Become the go-to condo agent
```text
/ask-the-team I want to position myself as the condo due-diligence expert in West Palm Beach. Tell me whether that niche makes sense given today's condo market and competitors, explain what buyers and sellers need to know about milestone inspections, SIRS, special assessments and financing, and create a lead magnet plus a month of social posts and one YouTube video script to launch it.
```
**Likely experts:** `market-analyst` + `competitive-positioning-strategist` → `condo-due-diligence-specialist` + `housing-finance-advisor` → `content-outreach-writer` (lead magnet) + `social-media-manager` + `video-youtube-producer` → `compliance-reviewer`.
**You get:** a go/no-go on the niche backed by market and competitor data, plain-language condo explainers, and draft launch content (all queued for your approval).

### Example 3: Open house to closing system
```text
/ask-the-team Design my full system for turning open house visitors into clients: the sign-in form (with proper consent for calls and texts), what happens in the CRM, the follow-up messages for the first 30 days, how I explain and sign the buyer agreement before touring, and which tools I need. Draft the sign-in form text and the first three follow-up messages.
```
**Likely experts:** `crm-follow-up-manager` + `marketing-ops-architect` → `consent-privacy-advisor` (consent language, Do-Not-Call, texting rules) → `content-outreach-writer` (follow-ups) → `regulatory-watch` (buyer agreement rules) → `compliance-reviewer`.
**You get:** a step-by-step workflow, a CRM and tool spec, a compliant consent checkbox, and drafted follow-ups in the approval queue.

### Example 4: Amendment 3 seller campaign
```text
/ask-the-team Florida voters just passed Amendment 3 on homestead property taxes. Explain what it means for long-time homeowners who are thinking about selling, then plan a compliant Q1 2027 campaign to reach them: a seller guide, a Meta ad test, a local seminar co-hosted with a CPA, and an email to my sphere. Tell me what it would cost and how I'd measure it.
```
**Likely experts:** `housing-finance-advisor` + `regulatory-watch` → `segmentation-strategist` (who to reach, by situation not demographics) → `content-outreach-writer` + `paid-ads-specialist` + `events-scout` + `partner-network-builder` (CPA co-host and RESPA check) → `budget-analyst` + `performance-analyst` → `consent-privacy-advisor` + `compliance-reviewer`.
**You get:** a plain-language explainer (with "talk to a CPA" flags), a campaign plan with budget and success measures, and drafts of the guide, ad, seminar invite, and email.

---

## 4. Tips for better answers

- **Give context:** your budget, hours per week, brokerage (if known), target areas, and deadline.
- **Say what you want back:** a plan, a comparison, a draft, a checklist, or a yes/no recommendation.
- **Ask for drafts by name:** "draft the email", "write three captions". Drafts land in `drafts/approval-queue/`.
- **Follow up in the same conversation:** "Have the compliance-reviewer re-check the revised ad" or "Make the email shorter."
- **Approve outgoing items:** open the file in `drafts/approval-queue/`, read the reviewer notes, tick **Approved**, then send or post it yourself.
- **Improve the team:** `/improve-team Add an expert for Spanish-language marketing review` creates or updates agents and skills. Review the changes with `git diff .claude/` before committing.

**What the team won't do (by design):** contact anyone, post or send anything, buy ads or leads, sign you up for anything, or target or describe people by protected characteristics such as race, religion, national origin, sex, familial status, disability, age, marital status, sexual orientation, or gender identity. If you ask, it will explain why and offer a compliant alternative.
