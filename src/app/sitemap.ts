import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/cms/queries";
import type { Href } from "@/i18n/navigation";
import { type AppPathname, type Locale, locales, routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC_PAGES: { pathname: AppPathname; priority: number; changeFrequency: ChangeFrequency }[] = [
  { pathname: "/", priority: 1, changeFrequency: "weekly" },
  { pathname: "/services", priority: 0.9, changeFrequency: "monthly" },
  { pathname: "/threat-map", priority: 0.8, changeFrequency: "hourly" },
  { pathname: "/technologies", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/about", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/team", priority: 0.6, changeFrequency: "monthly" },
  { pathname: "/clients", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/insights", priority: 0.7, changeFrequency: "weekly" },
  { pathname: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { pathname: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { pathname: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

const DETAIL_PAGES = [
  { collection: "services", pathname: "/services/[slug]", priority: 0.8 },
  { collection: "case-studies", pathname: "/clients/[slug]", priority: 0.6 },
  { collection: "posts", pathname: "/insights/[slug]", priority: 0.6 },
] as const;

function languageAlternates(urls: Partial<Record<Locale, string>>) {
  const fallback = urls[routing.defaultLocale];
  return { languages: { ...urls, ...(fallback ? { "x-default": fallback } : {}) } };
}

function staticEntries(): MetadataRoute.Sitemap {
  return STATIC_PAGES.flatMap(({ pathname, priority, changeFrequency }) => {
    const urls = Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(locale, pathname as Href)]));
    return locales.map((locale) => ({ url: urls[locale], priority, changeFrequency, alternates: languageAlternates(urls) }));
  });
}

async function detailEntries({ collection, pathname, priority }: (typeof DETAIL_PAGES)[number]): Promise<MetadataRoute.Sitemap> {
  const documents = Map.groupBy(await getPublishedSlugs(collection), (document) => document.id);
  return [...documents.values()].flatMap((translations) => {
    const urls = Object.fromEntries(
      translations.map(({ locale, slug }) => [locale, absoluteUrl(locale, { pathname, params: { slug } } as Href)]),
    );
    return translations.map(({ locale, updatedAt }) => ({
      url: urls[locale],
      lastModified: updatedAt,
      priority,
      changeFrequency: "monthly" as const,
      alternates: languageAlternates(urls),
    }));
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const details = await Promise.all(DETAIL_PAGES.map(detailEntries));
  return [...staticEntries(), ...details.flat()];
}
