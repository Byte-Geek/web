import { getTranslations } from "next-intl/server";
import { getServices } from "@/cms/queries";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Icon, IconBox } from "../ui/icon";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { ServicesMenu } from "./services-menu";
import { ThemeSwitch } from "./theme-toggle";
import { Wordmark } from "./wordmark";

const NAV_ITEMS = [
  { href: "/technologies", key: "technologies" },
  { href: "/about", key: "about" },
  { href: "/team", key: "team" },
  { href: "/insights", key: "insights" },
] as const;

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [t, common, services] = await Promise.all([
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getServices(locale),
  ]);
  const serviceHref = (slug?: string | null) => ({ pathname: "/services/[slug]" as const, params: { slug: slug ?? "" } });

  return (
    <header className="site-header">
      <div className="page flex h-(--header-height) items-center gap-3 nav:gap-6">
        <Wordmark label={`INTELLECT, ${common("home")}`} />
        <nav className="mx-auto hidden nav:flex" aria-label={t("main")}>
          <NavLink className="nav-link" href="/">
            {t("home")}
          </NavLink>
          <ServicesMenu label={t("services")}>
            <ul className="grid gap-1">
              {services.main.map((service) => (
                <li key={service.id}>
                  <Link className="flex gap-3 rounded-sm p-3 no-underline hover:bg-glow-soft" href={serviceHref(service.slug)}>
                    <IconBox name={service.icon} />
                    <span>
                      <b className="block text-[15px]">{service.title}</b>
                      <span className="line-clamp-2 text-sm text-muted">{service.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="grid content-start gap-1 border-l border-line p-3">
              <span className="label mb-2">{t("additional")}</span>
              {services.additional.map((service) => (
                <Link
                  key={service.id}
                  className="flex items-center gap-2.5 py-1.5 text-[15px] no-underline hover:text-accent-text"
                  href="/services"
                >
                  <Icon name={service.icon} className="icon size-[18px]" />
                  {service.title}
                </Link>
              ))}
              <Link className="text-link mt-3" href="/services">
                {t("allServices")}
                <Icon name="arrow" />
              </Link>
            </div>
          </ServicesMenu>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} className="nav-link" href={item.href}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 nav:ml-0">
          <div className="hidden nav:flex">
            <LocaleSwitcher />
          </div>
          <MobileMenu>
            <NavLink className="mobile-nav-link" href="/">
              {t("home")}
              <Icon name="arrow" />
            </NavLink>
            <details>
              <summary className="mobile-nav-link">
                {t("services")}
                <Icon name="down" />
              </summary>
              <ul className="mb-2 grid gap-1 pl-3">
                {services.main.map((service) => (
                  <li key={service.id}>
                    <Link className="flex min-h-12 items-center gap-3 no-underline" href={serviceHref(service.slug)}>
                      <Icon name={service.icon} />
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            {[...NAV_ITEMS, { href: "/contact", key: "contact" } as const].map((item) => (
              <NavLink key={item.href} className="mobile-nav-link" href={item.href}>
                {t(item.key)}
                <Icon name="arrow" />
              </NavLink>
            ))}
            <div className="mobile-nav-link mobile-nav-setting mt-4">
              {t("language")}
              <LocaleSwitcher />
            </div>
            <div className="mobile-nav-link mobile-nav-setting">
              {t("theme")}
              <ThemeSwitch />
            </div>
          </MobileMenu>
        </div>
        <Link className="btn btn-accent btn-sm hidden nav:inline-flex" href="/contact">
          {common("cta")}
          <Icon name="ne" />
        </Link>
      </div>
    </header>
  );
}
