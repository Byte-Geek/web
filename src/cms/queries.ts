import "server-only";
import config from "@payload-config";
import { type CollectionSlug, getPayload, type Where } from "payload";
import { cache } from "react";
import { type Locale, locales } from "@/i18n/routing";

const getClient = cache(() => getPayload({ config }));

const PUBLISHED: Where = { status: { equals: "published" } };
const TRANSLATED: Where = { title: { exists: true } };
const and = (...conditions: Where[]): Where => ({ and: conditions });

export type LocalizedSlugs = Partial<Record<Locale, string>>;
type SluggedCollection = "services" | "posts" | "case-studies";

export const getSettings = cache(async (locale: Locale) => (await getClient()).findGlobal({ slug: "site-settings", locale, depth: 1 }));
export const getHome = cache(async (locale: Locale) => (await getClient()).findGlobal({ slug: "home", locale, depth: 0 }));
export const getAbout = cache(async (locale: Locale) => (await getClient()).findGlobal({ slug: "about", locale, depth: 0 }));
export const getLegal = cache(async (locale: Locale) => (await getClient()).findGlobal({ slug: "legal", locale, depth: 1 }));
export const getThreatSnapshot = cache(async () => (await getClient()).findGlobal({ slug: "threat-snapshot", depth: 0 }));

export const getServices = cache(async (locale: Locale) => {
  const { docs } = await (await getClient()).find({
    collection: "services",
    locale,
    where: and(PUBLISHED, TRANSLATED),
    sort: "order",
    limit: 50,
    depth: 1,
  });
  return { main: docs.filter((service) => service.kind === "main"), additional: docs.filter((service) => service.kind === "additional") };
});

export const getTechnologies = cache(async (locale: Locale) => {
  const { docs } = await (await getClient()).find({ collection: "technologies", locale, sort: "order", limit: 300, depth: 0 });
  return docs;
});

export const getTeam = cache(async (locale: Locale) => {
  const { docs } = await (await getClient()).find({ collection: "team", locale, where: PUBLISHED, sort: "order", limit: 200, depth: 1 });
  return docs;
});

export const getClients = cache(async (locale: Locale) => {
  const { docs } = await (await getClient()).find({ collection: "clients", locale, where: PUBLISHED, sort: "order", limit: 50, depth: 1 });
  return docs;
});

export const getCaseStudies = cache(async (locale: Locale) => {
  const { docs } = await (await getClient()).find({
    collection: "case-studies",
    locale,
    where: and(PUBLISHED, TRANSLATED),
    sort: "order",
    limit: 100,
    depth: 1,
  });
  return docs;
});

export const getPosts = cache(async (locale: Locale, limit = 100) => {
  const { docs } = await (await getClient()).find({
    collection: "posts",
    locale,
    where: and(PUBLISHED, TRANSLATED),
    sort: "-publishedAt",
    limit,
    depth: 1,
  });
  return docs;
});

async function findBySlug<C extends SluggedCollection>(collection: C, locale: Locale, slug: string, extra: Where[] = [], depth = 0) {
  const client = await getClient();
  const { docs } = await client.find({ collection, locale, where: and(PUBLISHED, { slug: { equals: slug } }, ...extra), limit: 1, depth });
  const doc = docs[0];
  if (!doc) return null;
  return { doc, slugs: await getLocalizedSlugs(collection, doc.id) };
}

export const getService = cache((locale: Locale, slug: string) => findBySlug("services", locale, slug, [{ kind: { equals: "main" } }], 1));
export const getCaseStudy = cache((locale: Locale, slug: string) => findBySlug("case-studies", locale, slug, [], 1));
export const getPost = cache((locale: Locale, slug: string) => findBySlug("posts", locale, slug, [], 2));

async function getLocalizedSlugs(collection: SluggedCollection, id: number | string): Promise<LocalizedSlugs> {
  const doc = (await (await getClient()).findByID({ collection, id, locale: "all", depth: 0 })) as unknown as {
    slug?: LocalizedSlugs;
    title?: LocalizedSlugs;
  };
  return Object.fromEntries(
    locales.filter((locale) => doc.slug?.[locale] && doc.title?.[locale]).map((locale) => [locale, doc.slug?.[locale]]),
  );
}

export async function getPublishedSlugs(collection: SluggedCollection) {
  const client = await getClient();
  const where = collection === "services" ? and(PUBLISHED, TRANSLATED, { kind: { equals: "main" } }) : and(PUBLISHED, TRANSLATED);
  const perLocale = await Promise.all(
    locales.map(async (locale) => {
      const { docs } = await client.find({ collection, locale, where, limit: 500, depth: 0, select: { slug: true, updatedAt: true } });
      return docs.flatMap((doc) => (doc.slug ? [{ id: doc.id, locale, slug: doc.slug, updatedAt: doc.updatedAt }] : []));
    }),
  );
  return perLocale.flat();
}

export async function getAllSlugs(collection: SluggedCollection) {
  return (await getPublishedSlugs(collection)).map(({ locale, slug }) => ({ locale, slug }));
}

export async function saveContactMessage(data: Record<string, string | undefined> & { name: string; email: string; message: string }) {
  await (await getClient()).create({ collection: "contact-messages" satisfies CollectionSlug, data });
}
