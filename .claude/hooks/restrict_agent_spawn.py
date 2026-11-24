#!/usr/bin/env python3
"""PreToolUse guard for the orchestrator's Agent tool.

Only agents defined in this project's .claude/agents/ may be spawned (never built-in
general-purpose/Explore/Plan/fork agents, which carry broader tools), and never the
orchestrator itself or the meta agent. Exit code 2 blocks the call.
"""
import json
import os
import re
import sys

EXCLUDED = {"program-lead", "team-architect"}


def block(msg):
    print(f"BLOCKED by restrict_agent_spawn.py: {msg}", file=sys.stderr)
    sys.exit(2)


def names(root):
    out = set()
    d = os.path.join(root, ".claude", "agents")
    for f in os.listdir(d) if os.path.isdir(d) else []:
        if not f.endswith(".md"):
            continue
        try:
            text = open(os.path.join(d, f), encoding="utf-8").read()
        except OSError:
            continue
        m = re.search(r"^name:\s*(\S+)\s*$", text, re.M)
        if m:
            out.add(m.group(1).strip("'\""))
    return out - EXCLUDED


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        block("could not parse hook input.")
    root = os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd()
    sub = (data.get("tool_input") or {}).get("subagent_type")
    allowed = names(root)
    if not sub or sub not in allowed:
        block(f"subagent_type '{sub}' is not a team expert. Spawn one of: {', '.join(sorted(allowed))}.")
    sys.exit(0)


if __name__ == "__main__":
    main()
