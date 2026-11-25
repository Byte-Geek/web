import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { getSettings, getTechnologies } from "@/cms/queries";
import { TechnologyCard } from "@/components/cards/technology-card";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { Tabs } from "@/components/ui/tabs";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { TECHNOLOGY_CATEGORIES } from "@/lib/taxonomy";

const CATEGORY_ICONS = { security: "shield", backend: "code", frontend: "layers", mobile: "phone", cloud: "cloud", data: "spark" };

export async function generateMetadata({ params }: PageProps<"/[locale]/technologies">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "Technologies" });
  return pageMetadata({ locale, title: t("metaTitle"), description: t("lead"), href: "/technologies", kicker: t("kicker") });
}

export default async function TechnologiesPage({ params }: PageProps<"/[locale]/technologies">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, nav, technologies, settings] = await Promise.all([
    getTranslations({ locale, namespace: "Technologies" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTechnologies(locale),
    getSettings(locale),
  ]);
  const featured = technologies.filter((technology) => technology.featured);
  const others = technologies.filter((technology) => !technology.featured);
  const tabs = TECHNOLOGY_CATEGORIES.map((category) => ({
    id: category,
    label: t(`cat.${category}`),
    content: (
      <div className="glass grid gap-4 p-5">
        <div className="flex items-start gap-3.5">
          <Icon name={CATEGORY_ICONS[category]} className="icon size-9" />
          <div>
            <h2 className="heading-2">{t("catHead", { cat: t(`cat.${category}`) })}</h2>
            <p className="mt-1 max-w-[60ch] text-[13.5px] text-muted">{t(`catText.${category}`)}</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {featured
            .filter((technology) => technology.category === category)
            .map((technology) => (
              <li key={technology.id} className="grid">
                <TechnologyCard technology={technology} withNote />
              </li>
            ))}
        </ul>
      </div>
    ),
  }));

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("technologies") }]}
        currentUrl={absoluteUrl(locale, "/technologies")}
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        image={mediaUrl(settings.heroImages?.technologies) ?? "/images/hero/technologies.webp"}
      />

      <div className="page grid gap-8">
        <Tabs label={t("filter")} tabs={tabs} />

        {!!others.length && (
          <section aria-labelledby="other-technologies-title">
            <h2 id="other-technologies-title" className="heading-2 mb-3">
              {t("other")}
            </h2>
            <ul className="reveal flex flex-wrap gap-2.5">
              {others.map((technology) => (
                <li key={technology.id} className="glass tech-card px-5">
                  {technology.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="glass careers-card reveal" aria-labelledby="foundation-title">
          <div className="careers-image" style={{ "--img": "url(/images/foundation.webp)" } as CSSProperties} aria-hidden="true" />
          <div className="grid content-center gap-2 p-6">
            <h2 id="foundation-title" className="heading-2">
              {t("foundation")}
            </h2>
            <p className="text-muted">{t("foundationText")}</p>
          </div>
        </section>
      </div>
    </>
  );
}
