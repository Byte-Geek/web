import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Post } from "@/cms/payload-types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate, mediaUrl } from "@/lib/format";

// "row": picture left (home page); "stack": picture on top (news page).
export async function PostCard({ post, locale, layout = "row" }: { post: Post; locale: Locale; layout?: "row" | "stack" }) {
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: "Insights" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  const cover = mediaUrl(post.cover);
  return (
    <Link
      className={`glass reveal ${layout === "row" ? "media-card" : "grid"}`}
      href={{ pathname: "/insights/[slug]", params: { slug: post.slug ?? "" } }}
    >
      <div className={layout === "row" ? "media-card-image" : "relative aspect-[16/7] bg-surface-2"}>
        {cover && <Image src={cover} alt="" fill sizes="400px" className="object-cover" />}
      </div>
      <div className="grid content-center gap-2.5 p-5">
        <span className="tag">{t(`cat.${post.category}`)}</span>
        <h3 className="text-[16.5px] leading-snug font-bold">{post.title}</h3>
        <span className="text-[13px] text-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          {post.readingTime && <> · {common("minRead", { n: post.readingTime })}</>}
        </span>
      </div>
    </Link>
  );
}
