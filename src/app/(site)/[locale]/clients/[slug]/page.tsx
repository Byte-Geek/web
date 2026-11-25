import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Service, Technology } from "@/cms/payload-types";
import { getAllSlugs, getCaseStudies, getCaseStudy } from "@/cms/queries";
import { CaseRow } from "@/components/cards/case-row";
import { LocalizedSlugs } from "@/components/layout/localized-slugs";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { ogImagePath } from "@/features/seo/og-signature";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, pageMetadata, siteUrl } from "@/lib/seo";
import { organizationRef } from "@/lib/structured-data";

type Params = { locale: Locale; slug: string };
const caseHref = (slug: string) => ({ pathname: "/clients/[slug]" as const, params: { slug } });
const RELATED_CASES = 2;

export const generateStaticParams = () => getAllSlugs("case-studies");

export async function generateMetadata({ params }: PageProps<"/[locale]/clients/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as Params;
  const result = await getCaseStudy(locale, slug);
  if (!result) return {};
  const { doc, slugs } = result;
  return pageMetadata({
    locale,
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description || doc.summary,
    href: (target) => (slugs[target] ? caseHref(slugs[target]) : null),
    type: "article",
    kicker: doc.sector,
    modifiedTime: doc.updatedAt,
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/clients/[slug]">) {
  const { locale, slug } = (await params) as Params;
  setRequestLocale(locale);
  const result = await getCaseStudy(locale, slug);
  if (!result) notFound();
  const { doc: caseStudy, slugs } = result;
  const [t, clients, nav, allCases] = await Promise.all([
    getTranslations({ locale, namespace: "Case" }),
    getTranslations({ locale, namespace: "Clients" }),
    getTranslations({ locale, namespace: "Nav" }),
    getCaseStudies(locale),
  ]);
  const technologies = caseStudy.technologies?.filter((item): item is Technology => typeof item === "object") ?? [];
  const service = typeof caseStudy.service === "object" ? (caseStudy.service as Service | null) : null;
  const moreCases = allCases.filter((item) => item.id !== caseStudy.id).slice(0, RELATED_CASES);
  const facts = [
    [t("client"), caseStudy.client],
    [t("sector"), caseStudy.sector],
    [t("period"), caseStudy.period],
  ] as const;

  return (
    <>
      <LocalizedSlugs slugs={slugs} />
      <JsonLd
        data={{
          "@type": "Article",
          headline: caseStudy.title,
          description: caseStudy.summary,
          url: absoluteUrl(locale, caseHref(slug)),
          image: siteUrl() + ogImagePath({ title: caseStudy.title, kicker: caseStudy.sector ?? undefined }),
          inLanguage: locale,
          dateModified: caseStudy.updatedAt,
          datePublished: caseStudy.createdAt,
          author: organizationRef(),
          publisher: organizationRef(),
          about: technologies.map((technology) => technology.name),
        }}
      />
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("clients"), href: "/clients" }, { label: caseStudy.title }]}
        currentUrl={absoluteUrl(locale, caseHref(slug))}
        kicker={clients(`domain.${caseStudy.domain}`)}
        title={caseStudy.title}
        lead={caseStudy.summary}
      />

      <section className="pt-12" aria-label={t("client")}>
        <dl className="page grid gap-3 sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label} className="glass flex flex-col-reverse gap-1 p-4">
              <dt className="label">{label}</dt>
              <dd className="font-bold">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section" aria-labelledby="context-title">
        <div className="page grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="prose">
            <h2 id="context-title">{t("context")}</h2>
            <p>{caseStudy.context}</p>
            <h2>{t("challenge")}</h2>
            <p>{caseStudy.challenge}</p>
            <h2>{t("solution")}</h2>
            <ul>
              {caseStudy.solution?.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
            <h2>{t("results")}</h2>
            <ul className="grid list-none! gap-3 pl-0!">
              {caseStudy.results?.map((item) => (
                <li key={item.id} className="glass flex items-center gap-3 p-4 text-text!">
                  <Icon name={item.icon} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <aside className="grid content-start gap-4">
            {!!technologies.length && (
              <div className="glass p-6">
                <h2 className="label mb-3">{t("stack")}</h2>
                <ul className="flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <li key={technology.id} className="rounded-full border border-line px-3 py-1.5 text-sm">
                      {technology.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {service && (
              <div className="glass p-6">
                <h2 className="label mb-3">{t("service")}</h2>
                <Link className="text-link" href={{ pathname: "/services/[slug]", params: { slug: service.slug ?? "" } }}>
                  {service.title}
                  <Icon name="arrow" />
                </Link>
              </div>
            )}
            <div className="glass grid gap-3.5 p-6">
              <h2 className="heading-3">{t("similar")}</h2>
              <p className="text-muted">{t("similarText")}</p>
              <Link className="btn btn-accent" href="/contact">
                {nav("contact")}
                <Icon name="arrow" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {!!moreCases.length && (
        <section className="section" aria-labelledby="more-title">
          <div className="page">
            <h2 id="more-title" className="kicker">
              {t("more")}
            </h2>
            <div className="grid gap-3">
              {moreCases.map((item) => (
                <CaseRow key={item.id} caseStudy={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
