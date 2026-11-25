import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const OG_PATH = "/og";
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TEXT_LIMITS = { title: 140, kicker: 60 };

export type OgContent = { title: string; kicker?: string };

const SIGNATURE_LENGTH = 16;

function sign({ title, kicker = "" }: OgContent) {
  const secret = process.env.PAYLOAD_SECRET ?? "";
  return createHmac("sha256", secret).update(`${title}\n${kicker}`).digest("base64url").slice(0, SIGNATURE_LENGTH);
}

export function ogImagePath(content: OgContent) {
  const title = content.title.slice(0, OG_TEXT_LIMITS.title);
  const kicker = content.kicker?.slice(0, OG_TEXT_LIMITS.kicker);
  const params = new URLSearchParams({ title, ...(kicker ? { kicker } : {}) });
  params.set("s", sign({ title, kicker }));
  return `${OG_PATH}?${params}`;
}

export function hasValidSignature(content: OgContent, signature: string | null) {
  if (!signature) return false;
  const expected = Buffer.from(sign(content));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
