import { getTranslations } from "next-intl/server";
import { getHome, getServices } from "@/cms/queries";
import { ServiceCard } from "@/components/cards/service-card";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/i18n/routing";

const HOME_ICONS = ["code", "shieldHalf", "stack"];

export async function ServicesSection({ locale }: { locale: Locale }) {
  const [t, home, services] = await Promise.all([getTranslations({ locale, namespace: "Services" }), getHome(locale), getServices(locale)]);
  return (
    <section className="section" aria-labelledby="services-title">
      <BackgroundPaths className="services-paths" count={36} speed={0.5} angle={-10}>
        <div className="page">
          <SectionHeading id="services-title" kicker={home.servicesHead?.kicker} title={home.servicesHead?.title} />
          <ul className="grid gap-6 md:grid-cols-3">
            {services.main.slice(0, HOME_ICONS.length).map((service, index) => (
              <li key={service.id} className="reveal grid">
                <ServiceCard service={service} cta={t("explore")} icon={HOME_ICONS[index]} wave={index} />
              </li>
            ))}
          </ul>
        </div>
      </BackgroundPaths>
    </section>
  );
}
