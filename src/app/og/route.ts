import { renderOgImage } from "@/features/seo/og-image";
import { hasValidSignature, OG_TEXT_LIMITS } from "@/features/seo/og-signature";
import { siteUrl } from "@/lib/seo";

const ONE_YEAR_SECONDS = 31_536_000;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const title = params.get("title")?.slice(0, OG_TEXT_LIMITS.title) ?? "";
  const kicker = params.get("kicker")?.slice(0, OG_TEXT_LIMITS.kicker) || undefined;
  if (!title || !hasValidSignature({ title, kicker }, params.get("s"))) return new Response("Not found", { status: 404 });

  const image = await renderOgImage({ title, kicker }, new URL(siteUrl()).host);
  image.headers.set("Cache-Control", `public, max-age=${ONE_YEAR_SECONDS}, immutable`);
  return image;
}
