# Expert Team web app

A small React app for talking to the RealEstateTeam expert agents in your browser:

- **Sidebar:** every agent with its first name, role, voice, and model (opus, sonnet, or haiku).
- **Chat window:** talk to one expert, with follow-up questions.
- **Ask the whole team:** Morgan, the Program Lead, picks the experts. They answer in parallel, Grace (compliance) and Ivy (consent) review any drafts, and Morgan returns one combined answer. You can expand each expert's contribution.
- **Drafts only:** the app shows drafts. It never sends, posts, publishes, or buys anything. You review each draft and send it yourself.

## How it works

```
Browser (React)  ──POST /api/chat──▶  Netlify Function (web/netlify/functions/chat.mts)  ──▶  Claude API
   no API key                          reads ANTHROPIC_API_KEY from Netlify env vars
```

- **At build time**, `scripts/build-team.mjs` reads `.claude/agents/`, `.claude/skills/`, `docs/`, and `knowledge/` from this repo:
  - The browser gets only names, personas, and models.
  - The system prompts, skills, docs, and knowledge files go into the server function bundle.
- **The API key never reaches the browser.** Only the Netlify Function calls Claude, using the `ANTHROPIC_API_KEY` environment variable.
- **One model call per request.** "Ask the whole team" runs four short steps from the browser (plan → experts → review → combined answer), streamed so you see text as it arrives. This keeps each request inside Netlify's function time limit.
- **Models** come from each agent's `model:` field: opus → `claude-opus-5-5`, sonnet → `claude-sonnet-5-5`, haiku → `claude-haiku-5-5`.
- **Refusal fallback:** Opus and Sonnet calls use Claude's server-side refusal fallback (`fallbacks: "default"`), so a request one model declines can be re-run on a fallback model. Haiku has no server-side fallback.
- **In the web app, agents have no tools.** They can't browse, read files, or write to `drafts/`. Their skills, docs, and knowledge are already included in their instructions, and they're told to mark anything that needs live data as unverified.

## Deploy to Netlify (step by step)

You need a Netlify account, a Claude API key from the [Claude Console](https://platform.claude.com/), and this repository on GitHub.

1. **Get a Claude API key.** In the Claude Console, open **API keys**, create a key, and copy it. While you're there, set a monthly **spend limit**. The app can make several Opus calls per team question.
2. **Create the site.** In Netlify: **Add new project → Import an existing project → GitHub**, then pick this repository.
3. **Keep the build settings as they are.** `netlify.toml` at the repo root already sets everything:
   - base directory: `web`
   - build command: `npm ci && npm run build`
   - publish directory: `dist`
   - functions directory: `netlify/functions`
   - Node version: 22

   Leave the fields Netlify pre-fills.
4. **Add environment variables.** Before the first deploy, or afterwards under **Project configuration → Environment variables**, add:
   | Name | Value | Required? |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | your Claude API key | **Yes** |
   | `APP_PASSWORD` | a password you choose | Optional, but strongly recommended |

   Mark `ANTHROPIC_API_KEY` as a secret if Netlify offers it. Never put either value in a file in this repo, because the repo is public.
5. **Deploy.** Click **Deploy**. If you added the variables after the first deploy, go to **Deploys → Trigger deploy → Deploy site** so the function picks them up.
6. **Test it.**
   - Open the site URL and enter your `APP_PASSWORD` if you set one.
   - Pick an expert, for example Elena, and ask a question.
   - Then try **Ask the whole team** with one of the starter prompts.
7. **Share it, optionally.** Send the URL and password to people who should use it. Anyone with both can spend your API credits.

**Updating the team:** when you change agents, skills, docs, or knowledge files and push to `main`, Netlify rebuilds and the app picks up the changes automatically.

## Run it locally

```bash
cd web
npm install
npm run build
```

`npm run build` reads the team, type-checks, and builds. To run the app together with its server function, use the Netlify CLI from the repo root:

```bash
ANTHROPIC_API_KEY=your-key APP_PASSWORD=test npx netlify dev
```

Then open http://localhost:8888. `npm run dev` alone starts only the front end, so `/api/chat` won't work without `netlify dev`.

## Security and privacy

- **The API key** is read only by the Netlify Function. The browser never receives it.
- **`APP_PASSWORD`** is a simple shared password. The browser keeps it in session storage for the tab and sends it with each request over HTTPS. The server compares it in constant time. Without it, anyone who finds the URL can use your credits.
- **Search engines** are told not to index the site (`noindex` headers in `netlify.toml`).
- **Public repo.** Everything in `knowledge/` and `docs/` ends up inside the function bundle, so keep using only sample or anonymized data. The build prints a warning if a knowledge file looks like it contains an email address, phone number, or credential.
- **Chat history** stays in your browser tab only. Nothing is stored on the server. Don't type real client names or personal details into the chat: they're sent to the Claude API.

## Limits and costs

- **Time limit.** Each step must finish inside Netlify's function time limit. Netlify documents 60 seconds for streaming functions, but some users report cut-offs at 30 seconds. Answers are capped in length, and the app tells you if a response was cut off. If that happens, ask a narrower question.
- **Cost.** A team question typically makes 4–8 model calls, several on Opus. A one-expert chat makes one call per message. Prompt caching cuts the cost of repeat calls to the same agent. Watch usage in the Claude Console.
- **Not advice.** The app is not legal, tax, insurance, or lending advice. Compliance outputs should be confirmed by the supervising broker or a Florida real estate attorney.

## Troubleshooting

| Symptom | Fix |
|---|---|
| "ANTHROPIC_API_KEY is not set" banner | Add the variable in Netlify, then trigger a new deploy |
| "Wrong or missing password" | Re-enter the `APP_PASSWORD` value. Changing it in Netlify needs a redeploy. |
| "The Claude API key is missing or invalid" | Check the key in the Claude Console and paste it again in Netlify |
| "Rate limited" | Wait a minute, or raise your usage tier in the Claude Console |
| Response cut off | Ask a narrower question, or ask an individual expert instead of the whole team |
| Build fails at `build-team` | An agent or skill file has malformed frontmatter. Run `npm run build:team` in `web/` to see which one. |

## Files

```
netlify.toml                      Netlify build settings (repo root)
web/scripts/build-team.mjs        Reads agents, skills, docs, knowledge at build time
web/netlify/functions/chat.mts    The only code that calls the Claude API
web/netlify/lib/team.ts           Builds each agent's system prompt
web/netlify/lib/auth.ts           Optional APP_PASSWORD check
web/src/App.tsx                   Sidebar, chat, and the "Ask the whole team" flow
web/src/api.ts                    Browser client for /api/chat (streaming)
```
