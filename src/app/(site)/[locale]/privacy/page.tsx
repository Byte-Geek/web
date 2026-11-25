import { setRequestLocale } from "next-intl/server";
import { LegalPage, legalMetadata } from "@/features/legal/legal-page";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = (await params) as { locale: Locale };
  return legalMetadata(locale, "privacy");
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <LegalPage locale={locale} kind="privacy" />;
}
