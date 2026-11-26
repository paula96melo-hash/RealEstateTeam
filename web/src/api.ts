// Browser-side API client. Talks only to our own Netlify Function (/api/chat); never to Claude directly.

const PASSWORD_KEY = "expert-team-password";

export function getPassword(): string {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? "";
  } catch {
    return "";
  }
}
export function setPassword(pw: string) {
  try {
    if (pw) sessionStorage.setItem(PASSWORD_KEY, pw);
    else sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    /* storage unavailable: password lives only for this page load */
  }
}

export class UnauthorizedError extends Error {}

export interface ServerConfig {
  mode?: "live" | "demo";
  passwordRequired: boolean;
  apiKeyConfigured: boolean;
}

export async function getConfig(): Promise<ServerConfig> {
  const res = await fetch("/api/chat", { method: "GET" });
  if (!res.ok) throw new Error(`Could not reach the server function (${res.status}). Is it deployed?`);
  return res.json();
}

function headers(): HeadersInit {
  return { "content-type": "application/json", "x-app-password": getPassword() };
}

async function errorFrom(res: Response): Promise<Error> {
  if (res.status === 401) return new UnauthorizedError("Wrong or missing password.");
  try {
    const body = await res.json();
    return new Error(body.error ?? `Request failed (${res.status})`);
  } catch {
    return new Error(`Request failed (${res.status})`);
  }
}

export interface Plan {
  framing: string;
  experts: { agent: string; brief: string }[];
  needs_compliance: boolean;
  needs_consent: boolean;
}

export async function requestPlan(question: string, context: string, signal?: AbortSignal): Promise<Plan> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ mode: "plan", question, context }),
    signal,
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export interface StreamResult {
  text: string;
  servedBy?: string;
  refusal?: string | null;
  stopReason?: string | null;
  cutOff: boolean;
}

/** POST a streaming request and call onText with each chunk. Resolves with the full text. */
export async function streamRequest(
  payload: Record<string, unknown>,
  onText: (full: string) => void,
  signal?: AbortSignal,
): Promise<StreamResult> {
  const res = await fetch("/api/chat", { method: "POST", headers: headers(), body: JSON.stringify(payload), signal });
  if (!res.ok || !res.body) throw await errorFrom(res);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let done = false;
  const result: StreamResult = { text: "", cutOff: true };

  const handleLine = (line: string) => {
    if (!line.trim()) return;
    let evt: Record<string, unknown>;
    try {
      evt = JSON.parse(line);
    } catch {
      return;
    }
    if (evt.type === "text") {
      text += String(evt.text ?? "");
      onText(text);
    } else if (evt.type === "done") {
      done = true;
      result.servedBy = evt.servedBy as string;
      result.refusal = (evt.refusal as string) ?? null;
      result.stopReason = (evt.stopReason as string) ?? null;
    } else if (evt.type === "error") {
      throw new Error(String(evt.message ?? "Server error"));
    }
  };

  for (;;) {
    const { value, done: streamDone } = await reader.read();
    if (value) buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      handleLine(buffer.slice(0, idx));
      buffer = buffer.slice(idx + 1);
    }
    if (streamDone) break;
  }
  handleLine(buffer);

  result.text = text;
  result.cutOff = !done; // stream ended without a "done" event: likely the function time limit
  return result;
}
