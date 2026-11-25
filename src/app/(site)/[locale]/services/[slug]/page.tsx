import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSlugs, getService } from "@/cms/queries";
import { LocalizedSlugs } from "@/components/layout/localized-slugs";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { organizationRef } from "@/lib/structured-data";

type Params = { locale: Locale; slug: string };
// Step icons are decoration only; the steps themselves come from the CMS.
const APPROACH_ICONS = ["search", "target", "code", "pulse"];
const serviceHref = (slug: string) => ({ pathname: "/services/[slug]" as const, params: { slug } });

export const generateStaticParams = () => getAllSlugs("services");

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as Params;
  const result = await getService(locale, slug);
  if (!result) return {};
  const { doc, slugs } = result;
  return pageMetadata({
    locale,
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description || doc.summary,
    href: (target) => (slugs[target] ? serviceHref(slugs[target]) : null),
    kicker: doc.kicker,
  });
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = (await params) as Params;
  setRequestLocale(locale);
  const result = await getService(locale, slug);
  if (!result) notFound();
  const { doc: service, slugs } = result;
  const [t, nav] = await Promise.all([getTranslations({ locale, namespace: "Service" }), getTranslations({ locale, namespace: "Nav" })]);
  const currentUrl = absoluteUrl(locale, serviceHref(slug));

  return (
    <>
      <LocalizedSlugs slugs={slugs} />
      <JsonLd
        data={{
          "@type": "Service",
          name: service.title,
          description: service.summary,
          url: currentUrl,
          provider: organizationRef(),
          areaServed: ["MD", "RO", "EU"],
        }}
      />
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("services"), href: "/services" }, { label: service.title }]}
        currentUrl={currentUrl}
        kicker={service.kicker}
        title={service.headline || service.title}
        lead={service.intro}
        image={mediaUrl(service.cover) ?? `/images/hero/service-${service.icon}.webp`}
        actions={
          <>
            <Link className="btn btn-accent btn-sm" href="/contact">
              {t("assessment")}
              <Icon name="arrow" />
            </Link>
            <Link className="btn btn-sm" href="/contact">
              {t("talk")}
            </Link>
          </>
        }
      />

      <div className="page grid gap-8">
        {!!service.guarantees?.length && (
          <dl className="glass stat-strip reveal" aria-label={t("guarantees")}>
            {service.guarantees.map((guarantee) => (
              <div key={guarantee.id} className="grid justify-items-center gap-1">
                <Icon name={guarantee.icon} className="icon size-6" />
                <div className="flex flex-col-reverse">
                  <dt className="label">{guarantee.label}</dt>
                  <dd className="text-[15px] font-bold">{guarantee.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}

        {!!service.subServices?.length && (
          <section aria-labelledby="sub-services-title">
            <h2 id="sub-services-title" className="heading-2 mb-3">
              {t("subServices")}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.subServices.map((item) => (
                <li key={item.id} className="glass reveal grid content-start gap-1.5 p-4">
                  <Icon name={item.icon} className="icon size-6" />
                  <h3 className="text-[15px] font-bold">{item.title}</h3>
                  <p className="text-[13px] text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!!service.approach?.length && (
          <section aria-labelledby="approach-title">
            <h2 id="approach-title" className="heading-2 mb-3">
              {t("approach")}
            </h2>
            <ol className="glass approach-steps reveal">
              {service.approach.map((step, index) => (
                <li key={step.id}>
                  <Icon name={APPROACH_ICONS[index % APPROACH_ICONS.length]} className="icon size-6" />
                  <h3 className="text-[14.5px] font-bold">{step.title}</h3>
                  <p className="text-[12.5px] text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  );
}
