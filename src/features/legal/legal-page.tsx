import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLegal } from "@/cms/queries";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { RichText } from "@/components/ui/rich-text";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

type LegalKind = "privacy" | "terms";
const HREF: Record<LegalKind, "/privacy" | "/terms"> = { privacy: "/privacy", terms: "/terms" };

export async function legalMetadata(locale: Locale, kind: LegalKind): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Legal" });
  return pageMetadata({ locale, title: t(kind), description: t(`${kind}Description`), href: HREF[kind] });
}

export async function LegalPage({ locale, kind }: { locale: Locale; kind: LegalKind }) {
  const [t, legal] = await Promise.all([getTranslations({ locale, namespace: "Legal" }), getLegal(locale)]);
  const content = legal[kind];
  const updatedAt = kind === "privacy" ? legal.privacyUpdated : legal.termsUpdated;

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: t(kind) }]}
        currentUrl={absoluteUrl(locale, HREF[kind])}
        title={t(kind)}
        lead={updatedAt ? t("updated", { date: formatDate(updatedAt, locale) }) : null}
      />
      <section className="pt-12">
        <div className="page">
          <div className="prose">
            <p className="callout mb-8">
              <Icon name="alert" />
              {t("draft")}
            </p>
            {content && <RichText content={content} />}
          </div>
        </div>
      </section>
    </>
  );
}
