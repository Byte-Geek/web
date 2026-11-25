import { setRequestLocale } from "next-intl/server";
import { LegalPage, legalMetadata } from "@/features/legal/legal-page";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = (await params) as { locale: Locale };
  return legalMetadata(locale, "terms");
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <LegalPage locale={locale} kind="terms" />;
}
