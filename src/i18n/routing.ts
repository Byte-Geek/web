import { defineRouting } from "next-intl/routing";

export const locales = ["ro", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "ro",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/services": { ro: "/servicii", en: "/services", ru: "/uslugi" },
    "/services/[slug]": { ro: "/servicii/[slug]", en: "/services/[slug]", ru: "/uslugi/[slug]" },
    "/technologies": { ro: "/tehnologii", en: "/technologies", ru: "/tehnologii" },
    "/about": { ro: "/despre", en: "/about", ru: "/o-nas" },
    "/team": { ro: "/echipa", en: "/team", ru: "/komanda" },
    "/clients": { ro: "/clienti", en: "/clients", ru: "/klienty" },
    "/clients/[slug]": { ro: "/clienti/[slug]", en: "/clients/[slug]", ru: "/klienty/[slug]" },
    "/insights": { ro: "/articole", en: "/insights", ru: "/stati" },
    "/insights/[slug]": { ro: "/articole/[slug]", en: "/insights/[slug]", ru: "/stati/[slug]" },
    "/threat-map": { ro: "/harta-amenintarilor", en: "/threat-map", ru: "/karta-ugroz" },
    "/contact": { ro: "/contact", en: "/contact", ru: "/kontakty" },
    "/privacy": { ro: "/confidentialitate", en: "/privacy", ru: "/konfidencialnost" },
    "/terms": { ro: "/termeni", en: "/terms", ru: "/usloviya" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;

export const LOCALE_META: Record<Locale, { short: string; name: string; bcp47: string; og: string }> = {
  ro: { short: "RO", name: "Română", bcp47: "ro-RO", og: "ro_RO" },
  en: { short: "EN", name: "English", bcp47: "en-GB", og: "en_GB" },
  ru: { short: "RU", name: "Русский", bcp47: "ru-RU", og: "ru_RU" },
};
