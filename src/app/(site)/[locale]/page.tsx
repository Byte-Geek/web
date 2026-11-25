import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHome } from "@/cms/queries";
import { CtaSection } from "@/components/ui/cta-section";
import { AboutSection } from "@/features/home/about-section";
import { ClientsSection } from "@/features/home/clients-section";
import { HeroSection } from "@/features/home/hero-section";
import { InsightsSection } from "@/features/home/insights-section";
import { ServicesSection } from "@/features/home/services-section";
import { TechnologyTabs } from "@/features/home/technology-tabs";
import { ThreatTeaser } from "@/features/home/threat-teaser";
import { WhyUs } from "@/features/home/why-us";
import { type Locale, routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

// "/favicon.ico" and other root paths land here as a "locale"; the layout's notFound() does not stop metadata or the page from running.
async function localeOrNotFound(params: PageProps<"/[locale]">["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await localeOrNotFound(params);
  const [t, home] = await Promise.all([getTranslations({ locale, namespace: "Meta" }), getHome(locale)]);
  return pageMetadata({
    locale,
    title: home.meta?.title || t("defaultTitle"),
    description: home.meta?.description || t("defaultDescription"),
    href: "/",
    isHome: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await localeOrNotFound(params);
  setRequestLocale(locale);

  return (
    <>
      <HeroSection locale={locale} />
      <ThreatTeaser locale={locale} />
      <div className="home-flow">
        <ServicesSection locale={locale} />
        <TechnologyTabs locale={locale} />
        <WhyUs locale={locale} />
        <ClientsSection locale={locale} />
        <AboutSection locale={locale} />
        <InsightsSection locale={locale} />
        <CtaSection locale={locale} />
      </div>
    </>
  );
}
