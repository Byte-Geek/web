import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { getSettings } from "@/cms/queries";
import { CopyButton } from "@/components/ui/copy-button";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/features/contact/contact-form";
import { StaticMap } from "@/features/contact/static-map";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { webPage } from "@/lib/structured-data";

function ContactDetail({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <Icon name={icon} className="icon mt-0.5 size-6" />
      <div className="grid text-[13.5px] text-muted [&_a]:no-underline [&_a:hover]:text-accent-text">
        <b className="text-text">{title}</b>
        {children}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "Contact" });
  return pageMetadata({ locale, title: t("metaTitle"), description: t("lead"), href: "/contact", kicker: t("kicker") });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, nav, settings] = await Promise.all([
    getTranslations({ locale, namespace: "Contact" }),
    getTranslations({ locale, namespace: "Nav" }),
    getSettings(locale),
  ]);
  return (
    <>
      <JsonLd data={webPage("ContactPage", absoluteUrl(locale, "/contact"), t("metaTitle"), locale)} />
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("contact") }]}
        currentUrl={absoluteUrl(locale, "/contact")}
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        image={mediaUrl(settings.heroImages?.contact) ?? "/images/hero/contact.webp"}
      />

      <section aria-label={t("kicker")}>
        <div className="page grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="grid content-start gap-5">
            <ContactDetail icon="mail" title={t("email")}>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </ContactDetail>
            {settings.phone && (
              <ContactDetail icon="phone" title={t("phone")}>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
              </ContactDetail>
            )}
            <ContactDetail icon="pin" title={t("address")}>
              <span className="whitespace-pre-line">{settings.address}</span>
            </ContactDetail>
            <ContactDetail icon="clock" title={t("hours")}>
              {settings.hours}
            </ContactDetail>
            {settings.geo?.lat != null && settings.geo.lng != null && (
              <StaticMap label={t("mapLabel")} lat={settings.geo.lat} lng={settings.geo.lng} />
            )}
          </div>
          <ContactForm privacyHref={getPathname({ locale, href: "/privacy" })} fallbackEmail={settings.email} />
        </div>
      </section>

      {settings.pgp?.fingerprint && (
        <section id="pgp" className="section" aria-labelledby="pgp-title">
          <div className="page">
            <div className="glass grid gap-4 p-[clamp(20px,3vw,32px)]">
              <div className="flex items-center gap-3.5">
                <span className="icon-box">
                  <Icon name="key" />
                </span>
                <div>
                  <h2 id="pgp-title" className="heading-3">
                    {t("pgpTitle")}
                  </h2>
                  <p className="text-muted">{t("pgpText")}</p>
                </div>
              </div>
              <div className="grid justify-items-start gap-2.5">
                <span className="label">{t("fingerprint")}</span>
                <code className="rounded-sm bg-surface-2 px-3 py-2 font-mono text-sm break-all">{settings.pgp.fingerprint}</code>
                <CopyButton text={settings.pgp.fingerprint} />
              </div>
              {settings.pgp.publicKey && (
                <details>
                  <summary className="text-link cursor-pointer">{t("showKey")}</summary>
                  <pre className="mt-3 overflow-x-auto rounded-sm bg-surface-2 p-4 font-mono text-xs">{settings.pgp.publicKey}</pre>
                </details>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
