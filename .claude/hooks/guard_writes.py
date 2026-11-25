#!/usr/bin/env python3
"""PreToolUse guard for Write/Edit in team subagents.

Usage (from an agent's frontmatter hook):
    python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/guard_writes.py" drafts [.claude/agents .claude/skills]

- Blocks any write outside the allowed project directories given as arguments.
- Writes to .claude/agents/*.md and .claude/skills/**/*.md are validated so an agent
  or skill can never gain tools that send, post, publish, buy, or run shell commands,
  and can never drop the write/spawn guard hooks.
Exit code 2 blocks the tool call and shows the message to the agent.
"""
import json
import os
import re
import sys

ALLOWED_AGENT_TOOLS = {
    "Read", "Grep", "Glob", "Skill", "Write", "Edit",
    "WebSearch", "WebFetch", "TodoWrite", "Agent",
}
FORBIDDEN_AGENT_FIELDS = ("permissionMode", "mcpServers", "memory", "isolation")
META_AGENT = "team-architect"
META_DIRS = {"drafts", ".claude/agents", ".claude/skills"}


def block(msg):
    print(f"BLOCKED by guard_writes.py: {msg}", file=sys.stderr)
    sys.exit(2)


def frontmatter(text):
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return lines[1:i]
    return None


def field(fm, key):
    for line in fm:
        m = re.match(rf"^{re.escape(key)}\s*:\s*(.*)$", line)
        if m:
            return m.group(1).strip()
    return None


def project_agent_names(root):
    names = set()
    d = os.path.join(root, ".claude", "agents")
    if os.path.isdir(d):
        for f in os.listdir(d):
            if f.endswith(".md"):
                try:
                    fm = frontmatter(open(os.path.join(d, f), encoding="utf-8").read()) or []
                except OSError:
                    continue
                n = field(fm, "name")
                if n:
                    names.add(n.strip("'\""))
    return names


def parse_hooks(fm):
    """Return list of (matcher, [commands]) for PreToolUse hooks; uses PyYAML if available."""
    text = "\n".join(fm)
    try:
        import yaml  # optional
        data = yaml.safe_load(text) or {}
        out = []
        for entry in ((data.get("hooks") or {}).get("PreToolUse") or []):
            cmds = [h.get("command", "") for h in (entry.get("hooks") or []) if h.get("type") == "command"]
            out.append((str(entry.get("matcher", "")), cmds))
        return out
    except ImportError:
        pass
    except Exception:
        block("agent frontmatter YAML does not parse.")
    # Fallback line parser for the exact structure this team uses.
    out, in_hooks, in_pre, cur = [], False, False, None
    for line in fm:
        if re.match(r"^\S", line):
            in_hooks = bool(re.match(r"^hooks\s*:\s*$", line)); in_pre = False; continue
        if in_hooks and re.match(r"^  PreToolUse\s*:\s*$", line):
            in_pre = True; continue
        if in_hooks and re.match(r"^  \S", line):
            in_pre = False; continue
        if in_pre:
            m = re.match(r"^    - matcher\s*:\s*['\"]?([^'\"]*)['\"]?\s*$", line)
            if m:
                cur = (m.group(1), []); out.append(cur); continue
            m = re.match(r"^\s+command\s*:\s*(.+)$", line)
            if m and cur is not None:
                cur[1].append(m.group(1))
    return out


def has_hook(hooks, needed, script):
    for matcher, cmds in hooks:
        parts = set(re.split(r"[|,\s]+", matcher))
        if needed <= parts and any(script in c for c in cmds):
            return True
    return False


def validate_agent(text):
    fm = frontmatter(text)
    if fm is None:
        block("agent file must start with YAML frontmatter between --- lines.")
    name = (field(fm, "name") or "").strip("'\"")
    if not name or not field(fm, "description"):
        block("agent frontmatter needs both name and description.")
    for f in FORBIDDEN_AGENT_FIELDS:
        if field(fm, f) is not None:
            block(f"agent frontmatter field '{f}' is not allowed on this team.")
    model = (field(fm, "model") or "").strip("'\"")
    if model and model not in ("opus", "sonnet", "haiku", "inherit") and not model.startswith("claude-"):
        block("model must be opus, sonnet, haiku, inherit, or a claude-* model ID.")
    tools = field(fm, "tools")
    if not tools:
        block("agent must declare an explicit single-line 'tools:' allowlist (omitting it inherits every tool).")
    tool_names = [re.sub(r"\(.*\)$", "", t.strip()) for t in re.split(r",(?![^()]*\))", tools) if t.strip()]
    bad = [t for t in tool_names if t not in ALLOWED_AGENT_TOOLS]
    if bad:
        block(f"tools not allowed for team agents: {', '.join(bad)}. Allowed: {', '.join(sorted(ALLOWED_AGENT_TOOLS))}.")
    if sum(1 for l in fm if re.match(r"^hooks\s*:", l)) > 1 or sum(1 for l in fm if re.match(r"^tools\s*:", l)) > 1:
        block("duplicate 'hooks:' or 'tools:' keys are not allowed.")
    hooks = parse_hooks(fm)
    if ("Write" in tool_names or "Edit" in tool_names) and not has_hook(hooks, {"Write", "Edit"}, "guard_writes.py"):
        block("agents with Write/Edit must keep a PreToolUse hook with matcher covering Write and Edit that runs guard_writes.py.")
    if "Agent" in tool_names and not has_hook(hooks, {"Agent"}, "restrict_agent_spawn.py"):
        block("agents with the Agent tool must keep a PreToolUse hook with matcher covering Agent that runs restrict_agent_spawn.py.")
    for line in fm:
        m = re.match(r"^\s*-?\s*type\s*:\s*['\"]?(\w+)", line)
        if m and m.group(1) != "command":
            block("agent hooks may only be of type 'command'.")
        if re.match(r"^\s*-?\s*(url|prompt)\s*:", line):
            block("agent hooks may not use url or prompt hooks.")
    commands = [c for _, cs in hooks for c in cs] + [l for l in fm if re.match(r"^\s+command\s*:", l)]
    for line in commands:
        if "guard_writes.py" not in line and "restrict_agent_spawn.py" not in line:
            block("agent hooks may only call guard_writes.py or restrict_agent_spawn.py.")
        if "guard_writes.py" in line:
            args = line.split("guard_writes.py", 1)[1]
            args = args.split("||")[0].replace('"', " ").replace("'", " ").split()
            allowed = META_DIRS if name == META_AGENT else {"drafts"}
            extra = [a for a in args if a not in allowed]
            if extra:
                block(f"agent '{name}' may only write to {sorted(allowed)}; found {extra}.")

def validate_skill(text, root):
    fm = frontmatter(text) or []
    for f in ("allowed-tools", "hooks", "shell"):
        if field(fm, f) is not None:
            block(f"skill frontmatter field '{f}' is not allowed on this team.")
    agent = field(fm, "agent")
    if agent:
        if agent.strip("'\"") not in project_agent_names(root):
            block("skill 'agent:' must name a project agent from .claude/agents/.")
    for line in text.splitlines():
        s = line.lstrip()
        if s.startswith("```!") or re.search(r"(^|\s)!`", line):
            block("skills may not use ! shell-command injection.")


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        block("could not parse hook input.")
    allowed_dirs = sys.argv[1:] or ["drafts"]
    root = os.path.realpath(os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd())
    ti = data.get("tool_input") or {}
    path = ti.get("file_path") or ti.get("path")
    if not path:
        block("no file_path in tool input.")
    target = os.path.realpath(path if os.path.isabs(path) else os.path.join(root, path))
    rel = os.path.relpath(target, root).replace(os.sep, "/")
    ok_dir = None
    for d in allowed_dirs:
        d = d.strip("/")
        if rel == d or rel.startswith(d + "/"):
            ok_dir = d
            break
    if ok_dir is None or rel.startswith(".."):
        block(f"writes are limited to {allowed_dirs} inside the project; refused {rel}.")

    if ok_dir in (".claude/agents", ".claude/skills"):
        if not rel.endswith(".md"):
            block("only .md files may be written in .claude/agents and .claude/skills (no scripts).")
        if data.get("tool_name") == "Edit":
            try:
                current = open(target, encoding="utf-8").read()
            except OSError:
                block("cannot Edit a file that does not exist; use Write.")
            old, new = ti.get("old_string", ""), ti.get("new_string", "")
            text = current.replace(old, new) if ti.get("replace_all") else current.replace(old, new, 1)
        else:
            text = ti.get("content", "")
        if ok_dir == ".claude/agents":
            if "/" in rel[len(".claude/agents/"):]:
                block("agent files must sit directly in .claude/agents/.")
            validate_agent(text)
        else:
            validate_skill(text, root)
    sys.exit(0)


if __name__ == "__main__":
    main()
