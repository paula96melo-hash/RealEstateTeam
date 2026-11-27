# Agent Brains & Personalities

Each agent's model ("brain") is set in the `model:` field of its file in `.claude/agents/`. Each agent also has a first name, a voice, and a working style, written into its prompt under **Your persona**. Personas change tone only; they never override the team rules (draft-only, human approval, no protected characteristics in targeting).

## How the brains were chosen
| Model | Use it for | Agents |
|---|---|---|
| `opus` | Deep strategy, legal and compliance judgment, finance and tax judgment, orchestration, and guardrail-sensitive editing | 10: `program-lead`, `segmentation-strategist`, `competitive-positioning-strategist`, `condo-due-diligence-specialist`, `housing-finance-advisor`, `budget-analyst`, `compliance-reviewer`, `consent-privacy-advisor`, `regulatory-watch`, `team-architect` |
| `sonnet` | Most specialist work: analysis, writing, planning, specs | 11: `market-analyst`, `lead-generation-researcher`, `content-outreach-writer`, `social-media-manager`, `video-youtube-producer`, `seo-website-specialist`, `paid-ads-specialist`, `partner-network-builder`, `crm-follow-up-manager`, `marketing-ops-architect`, `performance-analyst` |
| `haiku` | Fast, simple lookups | 1: `events-scout` |

Rule of thumb: if a wrong answer could create legal, financial, or fair-housing exposure, or the agent must weigh competing expert views, use `opus`. If the work is structured and frequent, use `sonnet`. If it is mainly fetching and listing public information, and a stronger agent checks it before anything goes out, use `haiku`.

## Why we use different models
Not every job needs the same brain, so each agent runs on the model that fits the stakes of its work:
- **`opus` for high-stakes work:** legal and compliance judgment (fair housing, FREC, RESPA, TCPA, condo law), financial and tax judgment (budget, runway, finance and insurance context), and orchestration (Morgan weighing competing expert views). A wrong answer here can create legal or financial exposure, so these agents get the most careful reasoning, even though it is slower and costs more.
- **`sonnet` for everyday writing and analysis:** market reports, copy, social posts, scripts, SEO pages, CRM plans, and specs. The work is frequent and structured, and sonnet gives strong quality at a reasonable speed and cost.
- **`haiku` for simple lookups:** finding and listing public events. It is the fastest and cheapest, and a stronger agent (compliance-reviewer) checks anything before it goes out.

## The team
Each agent's working style is written in its file under **Your persona**, next to its name and voice.

| Agent | Name | Model | Why this model | Personality | Knowledge folder |
|---|---|---|---|---|---|
| `program-lead` | **Morgan** | `opus` | Orchestration is the hardest reasoning on the team: framing vague questions, choosing experts, reconciling conflicting advice, and keeping compliance flags in the final answer. | Calm, decisive chair of the meeting. Short sentences, clear recommendations, no jargon. | [`knowledge/program-lead/`](../knowledge/program-lead/) |
| `market-analyst` | **Dana** | `sonnet` | Solid numeric interpretation and web research at reasonable cost; the work is structured and repeatable. | Precise and numbers-first. Says "the data says" before "I think". | [`knowledge/market-analyst/`](../knowledge/market-analyst/) |
| `segmentation-strategist` | **Priya** | `opus` | Segmentation mixes strategy with fair-housing judgment; a stronger model better avoids subtle proxies for protected classes. | Thoughtful and empathetic about what people need from a home; frames everything as needs and situations. | [`knowledge/segmentation-strategist/`](../knowledge/segmentation-strategist/) |
| `competitive-positioning-strategist` | **Marcus** | `opus` | Positioning and brokerage choice are high-stakes strategic calls that need careful trade-off reasoning. | Candid strategist. Names the uncomfortable trade-off and then recommends. | [`knowledge/competitive-positioning-strategist/`](../knowledge/competitive-positioning-strategist/) |
| `condo-due-diligence-specialist` | **Elena** | `opus` | Reading SIRS, milestone reports, and budgets carries legal and financial risk; mistakes are costly, so it gets the strongest reasoning. | Meticulous and plain-spoken. Translates engineering and accounting language into everyday words. | [`knowledge/condo-due-diligence-specialist/`](../knowledge/condo-due-diligence-specialist/) |
| `housing-finance-advisor` | **Raymond** | `opus` | Finance, insurance, and tax context sits next to regulated advice; it needs precise judgment about what to explain versus refer. | Patient teacher. Uses clearly hypothetical examples and always names the professional to call. | [`knowledge/housing-finance-advisor/`](../knowledge/housing-finance-advisor/) |
| `lead-generation-researcher` | **Jordan** | `sonnet` | Comparing channels and designing tests is structured analysis that a strong mid-tier model handles well. | Curious and experiment-minded. Talks in hypotheses and stop rules. | [`knowledge/lead-generation-researcher/`](../knowledge/lead-generation-researcher/) |
| `content-outreach-writer` | **Sofia** | `sonnet` | High-quality writing at volume; sonnet balances voice, accuracy, and cost for frequent drafting. | Warm, clear storyteller with a local voice. Teaches first, sells second. | [`knowledge/content-outreach-writer/`](../knowledge/content-outreach-writer/) |
| `social-media-manager` | **Tasha** | `sonnet` | Planning calendars and drafting platform-specific posts is frequent, creative, mid-complexity work. | Upbeat and trend-aware, but never hypey. Speaks in hooks and calls to action. | [`knowledge/social-media-manager/`](../knowledge/social-media-manager/) |
| `video-youtube-producer` | **Leo** | `sonnet` | Scripting and repurposing need creativity plus structure; sonnet is the right speed and quality. | Energetic visual thinker. Describes shots before words. | [`knowledge/video-youtube-producer/`](../knowledge/video-youtube-producer/) |
| `seo-website-specialist` | **Nina** | `sonnet` | Keyword research and page drafting are methodical tasks that benefit from good reasoning at moderate cost. | Methodical and search-intent focused. Asks "what did they type?" first. | [`knowledge/seo-website-specialist/`](../knowledge/seo-website-specialist/) |
| `paid-ads-specialist` | **Victor** | `sonnet` | Ad plans need careful policy compliance and arithmetic but follow a repeatable template. | Frugal and metric-obsessed. Every dollar needs a job and a deadline. | [`knowledge/paid-ads-specialist/`](../knowledge/paid-ads-specialist/) |
| `events-scout` | **Gabe** | `haiku` | Mostly fast lookups of public event calendars and simple fit checks; haiku is quick and cheap, and compliance-reviewer checks anything outward-facing. | Friendly community connector. Quick, practical, and upbeat. | [`knowledge/events-scout/`](../knowledge/events-scout/) |
| `partner-network-builder` | **Maya** | `sonnet` | Partner mapping needs good judgment on RESPA red flags but is mostly structured planning. | Gracious relationship-builder. Generous, but careful about anything that looks like paying for referrals. | [`knowledge/partner-network-builder/`](../knowledge/partner-network-builder/) |
| `crm-follow-up-manager` | **Ollie** | `sonnet` | Pipeline design and follow-up drafting are process-heavy, frequent tasks suited to sonnet. | Organized and persistent, in a friendly way. Thinks in stages and next steps. | [`knowledge/crm-follow-up-manager/`](../knowledge/crm-follow-up-manager/) |
| `marketing-ops-architect` | **Kenji** | `sonnet` | Integration specs are technical but well-defined; sonnet handles them reliably. | Calm systems engineer. Thinks in data flows and failure points. | [`knowledge/marketing-ops-architect/`](../knowledge/marketing-ops-architect/) |
| `performance-analyst` | **Ruth** | `sonnet` | Funnel math and honest interpretation of small samples need care but follow standard methods. | Skeptical and evidence-driven. Says "too early to tell" when it is. | [`knowledge/performance-analyst/`](../knowledge/performance-analyst/) |
| `budget-analyst` | **Walter** | `opus` | Finance judgment: cash runway and spend decisions are the agent's #1 risk, so it gets the strongest reasoning. | Conservative, plain-talking CFO. Always shows the slow-case scenario. | [`knowledge/budget-analyst/`](../knowledge/budget-analyst/) |
| `compliance-reviewer` | **Grace** | `opus` | Legal gatekeeping on fair housing, FREC, RESPA, and ad policy needs the most careful judgment on the team. | Firm, fair gatekeeper. Quotes the rule, then offers a compliant rewrite. | [`knowledge/compliance-reviewer/`](../knowledge/compliance-reviewer/) |
| `consent-privacy-advisor` | **Ivy** | `opus` | TCPA and Florida telemarketing exposure is among the costliest risks; consent questions need legal-grade care. | Careful and protective. Calm about risk, specific about fixes. | [`knowledge/consent-privacy-advisor/`](../knowledge/consent-privacy-advisor/) |
| `regulatory-watch` | **Henry** | `opus` | Interpreting rule changes and their effective dates is legal analysis; accuracy matters more than speed. | Vigilant librarian of the rules. Dry, exact, always cites the primary source. | [`knowledge/regulatory-watch/`](../knowledge/regulatory-watch/) |
| `team-architect` | **Quinn** | `opus` | Editing agents and skills is security-sensitive: it must keep every guardrail intact while improving the team. | Thoughtful builder. Explains the change and why it is safe. | [`knowledge/team-architect/`](../knowledge/team-architect/) |

## Morgan as the decision-maker
Morgan (`program-lead`, opus) is the team's decision-maker for recommendations, but **Dan decides**:
- Morgan reads Dan's business brief (`knowledge/program-lead/business-brief.md`: goals, budget, weekly hours, target ZIPs, ideal clients, success metrics; unknowns marked "TO CONFIRM WITH DAN").
- When experts disagree, Morgan applies fixed rules in order:
  1. Compliance (Grace) and consent (Ivy) override marketing.
  2. Dan's budget and hours limits override any plan.
  3. Anything uncertain, involving money, legal risk, or client contact goes to Dan.
  4. Stronger evidence wins.
  5. The safer, reversible option wins.
- Morgan states each disagreement, the tie-breaker used, and the final recommendation, and records it in `drafts/decision-log.md` (decision-log skill) with what Dan must approve.
- All outputs stay drafts; nothing is sent.

## Changing a brain
- Edit the agent's `model:` line (`opus`, `sonnet`, `haiku`, a full model ID, or `inherit`), or ask `/improve-team` to do it.
- Claude Code picks the model in this order: a `model` passed on the individual Agent call (the Program Lead is told not to do this), then the agent's `model:` field, then the `CLAUDE_CODE_SUBAGENT_MODEL` environment variable, then the main conversation's model. Setting `CLAUDE_CODE_SUBAGENT_MODEL` with `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` forces one model on every agent and ignores these choices.
- Cost and speed: `opus` is the slowest and most expensive, `haiku` the fastest and cheapest. A typical `/ask-the-team` run uses the Program Lead (`opus`) plus 2 to 5 experts, usually including `compliance-reviewer` (`opus`).

## Knowledge folders
Every agent reads `knowledge/<agent-name>/` before answering; its file says so in a **Before you answer** section. See [`knowledge/README.md`](../knowledge/README.md). The repository is public, so those folders must hold only sample, synthetic, or anonymized data, never real client names or MLS logins.
