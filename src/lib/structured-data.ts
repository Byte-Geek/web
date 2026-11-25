import type { SiteSetting } from "@/cms/payload-types";
import { LOCALE_META, type Locale, locales } from "@/i18n/routing";
import { absoluteUrl, SITE_NAME, siteUrl } from "./seo";

const FOUNDING_YEAR = "2014";
const AREA_SERVED = ["MD", "RO", "EU"];

export const organizationRef = () => ({ "@id": `${siteUrl()}/#organization` });
const websiteRef = () => ({ "@id": `${siteUrl()}/#website` });

export function siteGraph(locale: Locale, settings: SiteSetting) {
  const organization = {
    "@type": "Organization",
    ...organizationRef(),
    name: SITE_NAME,
    alternateName: "Intellect Security",
    url: siteUrl(),
    logo: { "@type": "ImageObject", url: `${siteUrl()}/apple-icon`, width: 180, height: 180 },
    email: settings.email,
    telephone: settings.phone ?? undefined,
    foundingDate: FOUNDING_YEAR,
    areaServed: AREA_SERVED,
    address: { "@type": "PostalAddress", addressLocality: settings.city ?? undefined, addressCountry: "MD" },
    sameAs: settings.social?.map((social) => social.url),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: settings.email,
      availableLanguage: locales.map((code) => LOCALE_META[code].bcp47),
    },
    knowsAbout: [
      "Software development",
      "Cybersecurity",
      "Penetration testing",
      "Security operations",
      "Intelligence",
      "NIS2",
      "ISO 27001",
    ],
  };
  const website = {
    "@type": "WebSite",
    ...websiteRef(),
    url: absoluteUrl(locale, "/"),
    name: SITE_NAME,
    inLanguage: LOCALE_META[locale].bcp47,
    publisher: organizationRef(),
  };
  return { "@graph": [organization, website] };
}

export const webPage = (type: "AboutPage" | "ContactPage" | "CollectionPage", url: string, name: string, locale: Locale) => ({
  "@type": type,
  "@id": `${url}#webpage`,
  url,
  name,
  inLanguage: LOCALE_META[locale].bcp47,
  isPartOf: websiteRef(),
  about: organizationRef(),
});
