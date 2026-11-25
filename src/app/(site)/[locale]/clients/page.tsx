import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCaseStudies, getClients, getSettings } from "@/cms/queries";
import { CaseCard } from "@/components/cards/case-card";
import { ClientLogos } from "@/components/cards/client-logos";
import { PageHero } from "@/components/ui/page-hero";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/clients">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "Clients" });
  return pageMetadata({ locale, title: t("metaTitle"), description: t("lead"), href: "/clients", kicker: t("kicker") });
}

export default async function ClientsPage({ params }: PageProps<"/[locale]/clients">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, nav, clients, caseStudies, settings] = await Promise.all([
    getTranslations({ locale, namespace: "Clients" }),
    getTranslations({ locale, namespace: "Nav" }),
    getClients(locale),
    getCaseStudies(locale),
    getSettings(locale),
  ]);

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("clients") }]}
        currentUrl={absoluteUrl(locale, "/clients")}
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        image={mediaUrl(settings.heroImages?.clients) ?? "/images/hero/clients.webp"}
      />

      <div className="page grid gap-8">
        <div className="client-grid">
          <ClientLogos clients={clients} />
        </div>

        {caseStudies.length > 0 && (
          <section aria-labelledby="cases-title">
            <h2 id="cases-title" className="heading-2 mb-3">
              {t("successTitle")}
            </h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {caseStudies.map((caseStudy) => (
                <li key={caseStudy.id} className="grid">
                  <CaseCard caseStudy={caseStudy} locale={locale} layout="stack" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
