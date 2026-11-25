import type { Metadata } from "next";
import { ogImagePath } from "@/features/seo/og-signature";
import { getPathname, type Href } from "@/i18n/navigation";
import { LOCALE_META, type Locale, locales, routing } from "@/i18n/routing";

export const SITE_NAME = "INTELLECT";
const PRODUCTION_URL = "https://i-security.md";

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL).replace(/\/$/, "");

export const absoluteUrl = (locale: Locale, href: Href) => siteUrl() + getPathname({ locale, href });

type HrefFor = Href | ((locale: Locale) => Href | null);

type PageMetaInput = {
  locale: Locale;
  title: string;
  description?: string | null;
  href: HrefFor;
  kicker?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  isHome?: boolean;
};

function alternateLanguages(resolve: (locale: Locale) => Href | null) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const href = resolve(locale);
    if (href) languages[locale] = absoluteUrl(locale, href);
  }
  const fallback = resolve(routing.defaultLocale);
  if (fallback) languages["x-default"] = absoluteUrl(routing.defaultLocale, fallback);
  return languages;
}

export function pageMetadata(input: PageMetaInput): Metadata {
  const { locale, title, href, kicker, type = "website", publishedTime, modifiedTime, isHome = false } = input;
  const description = input.description ?? undefined;
  const resolve = (target: Locale) => (typeof href === "function" ? href(target) : href);
  const self = resolve(locale);
  const canonical = self ? absoluteUrl(locale, self) : undefined;
  const image = { url: ogImagePath({ title, kicker: kicker ?? undefined }), width: 1200, height: 630, alt: title };
  const alternateLocale = locales.filter((other) => other !== locale && resolve(other)).map((other) => LOCALE_META[other].og);

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: { canonical, languages: alternateLanguages(resolve) },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: LOCALE_META[locale].og,
      alternateLocale,
      images: [image],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
