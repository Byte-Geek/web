import { getSettings } from "@/cms/queries";
import { siteUrl } from "@/lib/seo";

export const revalidate = 86400;

const ONE_YEAR_MS = 365 * 86_400_000;

export async function GET() {
  const settings = await getSettings("ro");
  const base = siteUrl();
  const lines = [
    `Contact: mailto:${settings.securityEmail || settings.email}`,
    `Expires: ${new Date(Date.now() + ONE_YEAR_MS).toISOString()}`,
    settings.pgp?.fingerprint && `Encryption: ${base}/ro/contact#pgp`,
    "Preferred-Languages: ro, en, ru",
    `Canonical: ${base}/.well-known/security.txt`,
    `Policy: ${base}/ro/termeni`,
  ].filter(Boolean);
  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
