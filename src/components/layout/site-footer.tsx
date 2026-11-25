import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { getServices, getSettings } from "@/cms/queries";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Icon } from "../ui/icon";
import { Wordmark } from "./wordmark";

function FooterColumn({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="mb-2 text-[13px] font-bold">
        {title}
      </h2>
      <ul className="grid gap-0.5 [&_a]:inline-flex [&_a]:min-h-7 [&_a]:text-[13px] [&_a]:items-center [&_a]:text-muted [&_a]:no-underline [&_a:hover]:text-accent-text">
        {children}
      </ul>
    </nav>
  );
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, nav, settings, services] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getSettings(locale),
    getServices(locale),
  ]);

  return (
    <footer className="mt-[clamp(40px,5vw,64px)] border-t border-line pt-9 pb-[calc(20px+env(safe-area-inset-bottom))] text-[14px]">
      <div className="page">
        <div className="grid grid-cols-2 gap-7 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))_auto]">
          <div className="col-span-2 lg:col-span-1">
            <Wordmark label="INTELLECT" />
            <p className="mt-2 max-w-[32ch] text-[13px] text-muted">{settings.tagline}</p>
          </div>
          <FooterColumn id="footer-services" title={t("services")}>
            {services.main.map((service) => (
              <li key={service.id}>
                <Link href={{ pathname: "/services/[slug]", params: { slug: service.slug ?? "" } }}>{service.title}</Link>
              </li>
            ))}
          </FooterColumn>
          <FooterColumn id="footer-company" title={t("company")}>
            <li>
              <Link href="/about">{nav("about")}</Link>
            </li>
            <li>
              <Link href="/team">{nav("team")}</Link>
            </li>
            <li>
              <Link href={{ pathname: "/team", hash: "careers" }}>{t("careers")}</Link>
            </li>
            <li>
              <Link href="/clients">{nav("clients")}</Link>
            </li>
          </FooterColumn>
          <FooterColumn id="footer-resources" title={t("resources")}>
            <li>
              <Link href="/insights">{t("news")}</Link>
            </li>
            <li>
              <Link href="/technologies">{nav("technologies")}</Link>
            </li>
            <li>
              <Link href="/threat-map">{nav("map")}</Link>
            </li>
            <li>
              <Link href="/contact">{nav("contact")}</Link>
            </li>
          </FooterColumn>
          <ul className="col-span-2 flex gap-2 lg:col-span-1" aria-label={t("social")}>
            {settings.social?.map((social) => (
              <li key={social.id ?? social.network}>
                <a className="icon-button" href={social.url} aria-label={social.network} target="_blank" rel="noopener noreferrer">
                  <Icon name={social.network} className="size-4" />
                </a>
              </li>
            ))}
            <li>
              <a className="icon-button" href={`mailto:${settings.email}`} aria-label="Email">
                <Icon name="mail" className="size-4" />
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-[12px] text-muted">
          <span>
            © {new Date().getFullYear()} Intellect. {t("rights")}
          </span>
          <nav
            aria-label={t("legal")}
            className="flex gap-4 [&_a]:inline-flex [&_a]:min-h-9 [&_a]:items-center [&_a]:no-underline [&_a:hover]:text-accent-text"
          >
            <Link href="/privacy">{t("privacy")}</Link>
            <Link href="/terms">{t("terms")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
