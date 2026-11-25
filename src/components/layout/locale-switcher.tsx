"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, type Href, usePathname } from "@/i18n/navigation";
import { LOCALE_META, type Locale, locales } from "@/i18n/routing";
import { useLocalizedSlugs } from "./localized-slugs";

const DETAIL_PARENTS: Partial<Record<string, Href>> = {
  "/services/[slug]": "/services",
  "/clients/[slug]": "/clients",
  "/insights/[slug]": "/insights",
};

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const currentLocale = useLocale();
  const slugs = useLocalizedSlugs();

  const hrefFor = (locale: Locale): Href => {
    const parent = DETAIL_PARENTS[pathname];
    if (!parent) return pathname as Href;
    const slug = slugs?.[locale];
    return slug ? ({ pathname, params: { slug } } as Href) : parent;
  };

  return (
    <nav className="switch" aria-label={t("language")}>
      {locales.map((locale) => (
        <a
          key={locale}
          href={getPathname({ locale, href: hrefFor(locale) })}
          hrefLang={locale}
          lang={locale}
          aria-label={LOCALE_META[locale].name}
          aria-current={locale === currentLocale ? "true" : undefined}
        >
          {LOCALE_META[locale].short}
        </a>
      ))}
    </nav>
  );
}
