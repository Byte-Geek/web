import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaSection } from "@/components/ui/cta-section";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { AttackShape } from "@/features/threats/attack-shape";
import { ATTACK_TYPES } from "@/features/threats/attack-types";
import { CountryRanking } from "@/features/threats/country-ranking";
import { MapExplorer } from "@/features/threats/map-explorer";
import { getSnapshot } from "@/features/threats/snapshot";
import { TypeSplit } from "@/features/threats/type-split";
import type { Locale } from "@/i18n/routing";
import { countryName, formatNumber } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

const DATA_SOURCES = "Cloudflare Radar · abuse.ch · AbuseIPDB · DB-IP Lite";

export async function generateMetadata({ params }: PageProps<"/[locale]/threat-map">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "Map" });
  return pageMetadata({ locale, title: t("metaTitle"), description: t("metaDescription"), href: "/threat-map", kicker: t("kicker") });
}

export default async function ThreatMapPage({ params }: PageProps<"/[locale]/threat-map">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, threat, nav, snapshot] = await Promise.all([
    getTranslations({ locale, namespace: "Map" }),
    getTranslations({ locale, namespace: "Threat" }),
    getTranslations({ locale, namespace: "Nav" }),
    getSnapshot(),
  ]);

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("map") }]}
        currentUrl={absoluteUrl(locale, "/threat-map")}
        kicker={t("kicker")}
        title={t("title")}
      />

      <section className="pt-10" aria-label={t("title")}>
        <div className="page grid gap-4">
          {snapshot ? (
            <>
              <div className="glass">
                <MapExplorer initialEvents={snapshot.events} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <section className="glass grid content-start gap-4 p-6" aria-labelledby="counter-title">
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="counter-title" className="label">
                      {t("counter")}
                    </h2>
                    <span className="badge">Live</span>
                  </div>
                  <p className="text-[44px] leading-none font-extrabold tracking-tight tabular-nums">
                    {formatNumber(snapshot.total24h, locale)}
                  </p>
                  <p className="label">{threat("last24")}</p>
                  <TypeSplit split={snapshot.split} />
                </section>
                <div className="glass p-6">
                  <CountryRanking
                    sources={snapshot.sources.map((row) => ({ ...row, name: countryName(row.country, locale) }))}
                    targets={snapshot.targets.map((row) => ({ ...row, name: countryName(row.country, locale) }))}
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="callout">
              <Icon name="alert" />
              {threat("unavailable")}
            </p>
          )}
          <p className="label">
            {t("sourcesTitle")}: {DATA_SOURCES}
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="types-title">
        <div className="page">
          <SectionHeading id="types-title" kicker={t("kicker")} title={t("types")} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ATTACK_TYPES.map((type) => (
              <li key={type} className="glass reveal grid content-start gap-3 p-6">
                <h3 className="flex items-center gap-2.5 text-xl">
                  <AttackShape type={type} />
                  {threat(type)}
                </h3>
                <p className="text-[15px] text-muted">{t(`typeText.${type}`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="sources-title">
        <div className="page grid gap-8 lg:grid-cols-2">
          <div>
            <p className="kicker">{t("sourcesTitle")}</p>
            <h2 id="sources-title" className="heading-2 reveal">
              {t("honesty")}
            </h2>
          </div>
          <div className="glass reveal grid gap-4 p-6">
            <p className="text-muted">{t("sourcesText")}</p>
            <div className="callout">
              <Icon name="shield" />
              <span>
                <b className="block">{t("worried")}</b>
                {t("worriedText")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <CtaSection locale={locale} />
    </>
  );
}
