---
name: ask-the-team
description: "Ask the West Palm Beach Realtor expert team any question; the Program Lead picks the right experts, has them work together, and returns one combined answer. Use when a question spans market, marketing, operations, finance, or compliance."
argument-hint: [your question or request]
disable-model-invocation: true
context: fork
agent: program-lead
background: false
---

Answer this question for the West Palm Beach Realtor marketing project:

$ARGUMENTS

As the Program Lead, follow your workflow: frame the question, choose the smallest set of team experts that covers it, brief and run them (in parallel where independent), send anything outward-facing through compliance-reviewer (and consent-privacy-advisor for calls, texts, email, or contact data), and return one combined answer using the expert-panel-synthesis format. Drafts go to drafts/approval-queue/ for human approval. Nothing is sent, posted, published, or bought.
