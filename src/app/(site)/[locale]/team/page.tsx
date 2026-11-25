import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { getAbout, getSettings, getTeam } from "@/cms/queries";
import { MemberCard } from "@/components/cards/member-card";
import { FilterGrid } from "@/components/ui/filter-grid";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { DEPARTMENTS } from "@/lib/taxonomy";

export async function generateMetadata({ params }: PageProps<"/[locale]/team">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const [nav, about] = await Promise.all([getTranslations({ locale, namespace: "Nav" }), getAbout(locale)]);
  return pageMetadata({ locale, title: nav("team"), description: about.teamHead?.text, href: "/team", kicker: about.teamHead?.kicker });
}

export default async function TeamPage({ params }: PageProps<"/[locale]/team">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, nav, about, team, settings] = await Promise.all([
    getTranslations({ locale, namespace: "About" }),
    getTranslations({ locale, namespace: "Nav" }),
    getAbout(locale),
    getTeam(locale),
    getSettings(locale),
  ]);

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("team") }]}
        currentUrl={absoluteUrl(locale, "/team")}
        kicker={about.teamHead?.kicker}
        title={about.teamHead?.title}
        lead={about.teamHead?.text}
        image={mediaUrl(settings.heroImages?.team) ?? "/images/hero/team.webp"}
      />

      <section aria-label={nav("team")}>
        <div className="page">
          <FilterGrid
            label={t("filterTeam")}
            filters={DEPARTMENTS.map((id) => ({ id, label: t(`dept.${id}`) }))}
            gridClassName="team-grid grid grid-cols-2 gap-3 lg:grid-cols-4"
            emptyText={t("teamEmpty")}
            items={team.map((member) => ({ key: member.id, category: member.department, node: <MemberCard member={member} /> }))}
          />
        </div>
      </section>

      {about.careers?.title && (
        <section id="careers" className="pt-6" aria-labelledby="careers-title">
          <div className="page">
            <div className="glass careers-card reveal">
              <div className="careers-image" style={{ "--img": "url(/images/careers.webp)" } as CSSProperties} aria-hidden="true" />
              <div className="grid content-center gap-2 p-6">
                <h2 id="careers-title" className="heading-2">
                  {about.careers.title}
                </h2>
                <p className="text-muted">{about.careers.text}</p>
                {about.careers.email && (
                  <a className="btn btn-accent btn-sm mt-2 justify-self-start" href={`mailto:${about.careers.email}`}>
                    {t("careersCta")}
                    <Icon name="arrow" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
