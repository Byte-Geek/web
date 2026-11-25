import { getTranslations } from "next-intl/server";
import { getCaseStudies, getClients, getHome } from "@/cms/queries";
import { CaseCard } from "@/components/cards/case-card";
import { ClientLogos } from "@/components/cards/client-logos";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/i18n/routing";
import { CaseRail } from "./case-rail";

export async function ClientsSection({ locale }: { locale: Locale }) {
  const [t, home, clients, caseStudies] = await Promise.all([
    getTranslations({ locale, namespace: "Clients" }),
    getHome(locale),
    getClients(locale),
    getCaseStudies(locale),
  ]);

  return (
    <>
      {caseStudies.length > 0 && (
        <CaseRail kicker={t("casesKicker")} title={t("casesTitle")}>
          {caseStudies.map((caseStudy) => (
            <CaseCard key={caseStudy.id} caseStudy={caseStudy} locale={locale} />
          ))}
        </CaseRail>
      )}
      {clients.length > 0 && (
        <section className="section" aria-labelledby="clients-title">
          <div className="page">
            <SectionHeading id="clients-title" kicker={home.clientsHead?.kicker} title={home.clientsHead?.title} />
            <ClientLogos clients={clients} marquee />
          </div>
        </section>
      )}
    </>
  );
}
