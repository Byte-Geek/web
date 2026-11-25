import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getServices, getSettings } from "@/cms/queries";
import { ServiceCard } from "@/components/cards/service-card";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "Services" });
  return pageMetadata({ locale, title: t("metaTitle"), description: t("lead"), href: "/services", kicker: t("kicker") });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, nav, services, settings] = await Promise.all([
    getTranslations({ locale, namespace: "Services" }),
    getTranslations({ locale, namespace: "Nav" }),
    getServices(locale),
    getSettings(locale),
  ]);

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("services") }]}
        currentUrl={absoluteUrl(locale, "/services")}
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        image={mediaUrl(settings.heroImages?.services) ?? "/images/hero/services.webp"}
      />

      <div className="page grid gap-8">
        <ul className="grid gap-4 md:grid-cols-2" aria-label={t("mainTitle")}>
          {services.main.map((item) => (
            <li key={item.id} className="reveal grid">
              <ServiceCard service={item} cta={t("explore")} />
            </li>
          ))}
        </ul>

        {services.additional.length > 0 && (
          <section aria-labelledby="additional-title">
            <h2 id="additional-title" className="heading-2 mb-3">
              {t("additionalTitle")}
            </h2>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {services.additional.map((item) => (
                <li key={item.id} className="grid">
                  <Link className="glass tech-card reveal flex-col" href="/contact" title={item.summary}>
                    <Icon name={item.icon} className="icon size-6" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
