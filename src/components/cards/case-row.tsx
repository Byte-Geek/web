import { getTranslations } from "next-intl/server";
import type { CaseStudy } from "@/cms/payload-types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Icon } from "../ui/icon";

export async function CaseRow({ caseStudy, locale }: { caseStudy: CaseStudy; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Clients" });
  return (
    <Link
      className="glass group reveal grid grid-cols-[1fr_44px] items-center gap-2 px-6 py-5 md:grid-cols-[160px_minmax(0,1fr)_260px_44px] md:gap-6"
      href={{ pathname: "/clients/[slug]", params: { slug: caseStudy.slug ?? "" } }}
    >
      <span className="tag">{t(`domain.${caseStudy.domain}`)}</span>
      <h3 className="heading-3 col-start-1 transition-transform duration-300 ease-out group-hover:translate-x-1.5 md:col-start-auto">
        {caseStudy.title}
      </h3>
      <p className="col-start-1 text-[15px] text-muted md:col-start-auto">{caseStudy.summary}</p>
      <span className="col-start-2 row-span-3 row-start-1 grid size-11 place-items-center rounded-xl border border-border text-accent-text md:col-start-auto md:row-span-1 md:row-start-auto">
        <Icon name="ne" className="size-4" />
      </span>
    </Link>
  );
}
