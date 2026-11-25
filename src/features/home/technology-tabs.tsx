import { getTranslations } from "next-intl/server";
import { getHome, getTechnologies } from "@/cms/queries";
import { TechnologyCard } from "@/components/cards/technology-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs } from "@/components/ui/tabs";
import type { Locale } from "@/i18n/routing";
import { TECHNOLOGY_CATEGORIES } from "@/lib/taxonomy";

const PER_ROW = 5;

export async function TechnologyTabs({ locale }: { locale: Locale }) {
  const [t, home, technologies] = await Promise.all([
    getTranslations({ locale, namespace: "Technologies" }),
    getHome(locale),
    getTechnologies(locale),
  ]);
  const tabs = TECHNOLOGY_CATEGORIES.map((category) => ({
    id: category,
    label: t(`cat.${category}`),
    content: (
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {technologies
          .filter((technology) => technology.featured && technology.category === category)
          .slice(0, PER_ROW)
          .map((technology) => (
            <li key={technology.id} className="grid">
              <TechnologyCard technology={technology} />
            </li>
          ))}
      </ul>
    ),
  }));

  return (
    <section className="section" aria-labelledby="technologies-title">
      <div className="page">
        <SectionHeading id="technologies-title" kicker={home.techHead?.kicker} title={home.techHead?.title} />
        <Tabs label={t("filter")} tabs={tabs} />
      </div>
    </section>
  );
}
