import "server-only";

const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000, maxTrackedClients: 5000 };
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5000;

const requestLog = new Map<string, number[]>();

export function isRateLimited(clientIp: string) {
  const now = Date.now();
  const recent = (requestLog.get(clientIp) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);
  recent.push(now);
  if (requestLog.size > RATE_LIMIT.maxTrackedClients) requestLog.clear();
  requestLog.set(clientIp, recent);
  return recent.length > RATE_LIMIT.max;
}

export async function verifyTurnstile(token: string, clientIp: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: clientIp }),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
