#!/usr/bin/env node
/**
 * Build-time step: read the agent team from this repo and write two JSON files.
 *
 *   src/generated/team.json          -> public sidebar data for the browser (names, personas, models)
 *   netlify/generated/team-data.json -> server-only data for the Netlify Function
 *                                       (system prompts, skills, docs, knowledge files)
 *
 * Sources (relative to the repo root, one level above web/):
 *   .claude/agents/*.md, .claude/skills/<name>/SKILL.md, docs/*.md, knowledge/<agent>/*
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(here, "..");
const ROOT = path.resolve(WEB, "..");

const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

function splitFrontmatter(text, file) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`No frontmatter in ${file}`);
  return { fm: parseYaml(m[1]) ?? {}, body: m[2].trim() };
}

function section(body, heading) {
  const re = new RegExp(`^## ${heading}[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m");
  return body.match(re)?.[1]?.trim() ?? "";
}

function personaField(persona, label) {
  return persona.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`))?.[1]?.trim() ?? "";
}

// Group agents in the sidebar by the color each agent file uses.
const GROUP_BY_COLOR = {
  purple: "Orchestrator",
  blue: "Business & strategy",
  cyan: "Business domain",
  pink: "Marketing",
  green: "Operations & technical",
  yellow: "Finance",
  red: "Legal & compliance",
  orange: "Team builder",
};
const GROUP_ORDER = Object.values(GROUP_BY_COLOR);

const MODEL_IDS = { opus: "claude-opus-5-5", sonnet: "claude-sonnet-5-5", haiku: "claude-haiku-5-5" };

// ---------- skills ----------
const skillsDir = path.join(ROOT, ".claude", "skills");
const skills = {};
for (const name of fs.readdirSync(skillsDir).sort()) {
  const f = path.join(skillsDir, name, "SKILL.md");
  if (!fs.existsSync(f)) continue;
  const { fm, body } = splitFrontmatter(read(f), f);
  skills[fm.name || name] = { description: fm.description || "", body };
}

// ---------- docs ----------
const docsDir = path.join(ROOT, "docs");
const docs = {};
for (const f of fs.readdirSync(docsDir).sort()) {
  if (f.endsWith(".md")) docs[`docs/${f}`] = read(path.join(docsDir, f));
}

// ---------- knowledge ----------
const SUSPICIOUS = [
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, "an email address"],
  [/\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/, "a phone number"],
  [/\b(password|passwd|api[_-]?key|secret|token)\s*[:=]/i, "a credential"],
  [/sk-ant-[A-Za-z0-9_-]{10,}/, "an Anthropic API key"],
];
const warnings = [];
function readKnowledge(agent) {
  const dir = path.join(ROOT, "knowledge", agent);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, f);
    if (!fs.statSync(full).isFile() || !/\.(md|txt|csv|json)$/i.test(f)) continue;
    const content = read(full);
    for (const [re, label] of SUSPICIOUS) {
      if (re.test(content) && !/SAMPLE|FICTIONAL|SYNTHETIC|example\.com/i.test(content)) {
        warnings.push(`${rel(full)} may contain ${label}. This repo is public: use sample or anonymized data only.`);
      }
    }
    out.push({ path: rel(full), content });
  }
  return out;
}

// ---------- agents ----------
const agentsDir = path.join(ROOT, ".claude", "agents");
const agents = [];
for (const f of fs.readdirSync(agentsDir).sort()) {
  if (!f.endsWith(".md")) continue;
  const file = path.join(agentsDir, f);
  const { fm, body } = splitFrontmatter(read(file), file);
  if (!fm.name || !fm.description) continue;

  const persona = section(body, "Your persona");
  const firstName = personaField(persona, "Name") || fm.name;
  const roleMatch = body.match(/You are the \*\*(.+?)\*\*/);
  const title = fm.name === "team-architect" ? "Team Architect (meta agent)" : roleMatch?.[1] ?? fm.name;
  const tier = String(fm.model || "sonnet");
  const docRefs = [...new Set(["docs/README.md", ...(body.match(/docs\/[\w.-]+\.md/g) ?? [])])].filter((d) => docs[d]);
  const knowledge = readKnowledge(fm.name);

  agents.push({
    name: fm.name,
    firstName,
    title,
    description: String(fm.description),
    group: GROUP_BY_COLOR[fm.color] ?? "Other",
    color: fm.color ?? "gray",
    tier,
    modelId: MODEL_IDS[tier] ?? MODEL_IDS.sonnet,
    voice: personaField(persona, "Voice"),
    style: personaField(persona, "Working style"),
    skills: Array.isArray(fm.skills) ? fm.skills.filter((s) => skills[s]) : [],
    docRefs,
    knowledge,
    body,
  });
}

agents.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.firstName.localeCompare(b.firstName));

if (!agents.find((a) => a.name === "program-lead")) throw new Error("program-lead agent not found");

// ---------- write outputs ----------
const publicTeam = agents.map(({ body, knowledge, skills: s, docRefs, ...rest }) => ({
  ...rest,
  skillCount: s.length,
  knowledgeFiles: knowledge.map((k) => k.path),
}));
const serverData = { builtAt: new Date().toISOString(), agents, skills, docs };

// ---------- demo examples (saved answers shown when no API key is set) ----------
const demoDir = path.join(WEB, "demo-examples");
const demoExamples = [];
for (const f of fs.existsSync(demoDir) ? fs.readdirSync(demoDir).sort() : []) {
  if (!f.endsWith(".md") || f === "README.md") continue;
  const file = path.join(demoDir, f);
  const { fm, body } = splitFrontmatter(read(file), file);
  for (const key of ["id", "agent", "title", "question"]) {
    if (!fm[key]) throw new Error(`Demo example ${rel(file)} is missing "${key}"`);
  }
  if (!agents.find((a) => a.name === fm.agent)) throw new Error(`Demo example ${rel(file)} names unknown agent "${fm.agent}"`);
  if (demoExamples.find((e) => e.id === fm.id)) throw new Error(`Duplicate demo example id "${fm.id}"`);
  for (const [re, label] of SUSPICIOUS) {
    if (re.test(body) && !/SAMPLE|FICTIONAL|placeholder/i.test(body)) warnings.push(`${rel(file)} may contain ${label}.`);
  }
  demoExamples.push({
    id: String(fm.id),
    agent: String(fm.agent),
    title: String(fm.title),
    question: String(fm.question),
    keywords: Array.isArray(fm.keywords) ? fm.keywords.map(String) : [],
    made: fm.made ? String(fm.made) : "",
    input: fm.input ? String(fm.input).trim() : "",
    team: fm.team === true,
    partOf: fm.partOf ? String(fm.partOf) : null,
    order: Number(fm.order ?? 0),
    answer: body,
  });
}
for (const e of demoExamples) {
  if (e.partOf && !demoExamples.find((x) => x.id === e.partOf)) throw new Error(`Demo example ${e.id} has unknown partOf "${e.partOf}"`);
}

fs.mkdirSync(path.join(WEB, "src", "generated"), { recursive: true });
fs.writeFileSync(path.join(WEB, "src", "generated", "demo-examples.json"), JSON.stringify(demoExamples, null, 2));
fs.mkdirSync(path.join(WEB, "netlify", "generated"), { recursive: true });
fs.writeFileSync(path.join(WEB, "src", "generated", "team.json"), JSON.stringify(publicTeam, null, 2));
fs.writeFileSync(path.join(WEB, "netlify", "generated", "team-data.json"), JSON.stringify(serverData));

const kb = Math.round(Buffer.byteLength(JSON.stringify(serverData)) / 1024);
console.log(`build-team: ${agents.length} agents, ${Object.keys(skills).length} skills, ${Object.keys(docs).length} docs, ` +
  `${agents.reduce((n, a) => n + a.knowledge.length, 0)} knowledge files (${kb} KB server data)`);
console.log(`build-team: ${demoExamples.length} demo examples`);
for (const w of warnings) console.warn(`build-team WARNING: ${w}`);
