import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { CaseStudy } from "@/cms/payload-types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";

// "row": picture left (home); "stack": picture on top (clients page).
export async function CaseCard({ caseStudy, locale, layout = "row" }: { caseStudy: CaseStudy; locale: Locale; layout?: "row" | "stack" }) {
  const t = await getTranslations({ locale, namespace: "Clients" });
  const cover = mediaUrl(caseStudy.cover);
  return (
    <Link
      className={`glass reveal ${layout === "row" ? "media-card" : "grid"}`}
      href={{ pathname: "/clients/[slug]", params: { slug: caseStudy.slug ?? "" } }}
    >
      <div className={layout === "row" ? "media-card-image" : "media-card-image aspect-[16/7]"}>
        {cover && <Image src={cover} alt="" fill sizes="200px" className="object-cover" />}
      </div>
      <div className="grid content-center gap-2.5 p-5">
        <span className="tag">{t(`domain.${caseStudy.domain}`)}</span>
        <h3 className="text-[16.5px] leading-snug font-bold">{caseStudy.title}</h3>
        <p className="line-clamp-3 text-[13.5px] leading-relaxed text-muted">{caseStudy.summary}</p>
      </div>
    </Link>
  );
}
