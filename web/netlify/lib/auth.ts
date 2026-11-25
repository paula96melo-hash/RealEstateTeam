import { createHash, timingSafeEqual } from "node:crypto";

const digest = (s: string) => createHash("sha256").update(s, "utf8").digest();

/** APP_PASSWORD is optional. When it is set, every API call must send it in the x-app-password header. */
export function passwordRequired(): boolean {
  return Boolean(process.env.APP_PASSWORD);
}

export function isAuthorized(req: Request): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return true;
  const given = req.headers.get("x-app-password") ?? "";
  return timingSafeEqual(digest(given), digest(expected));
}
