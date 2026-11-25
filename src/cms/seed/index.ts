import { type CollectionSlug, getPayload } from "payload";
import config from "../payload.config.ts";
import { cases, clients, posts, team, technologies } from "./data/collections.ts";
import { about, home, legal, settings } from "./data/globals.ts";
import { services } from "./data/services.ts";
import { toRichText } from "./lexical.ts";

const LOCALES = ["ro", "en", "ru"] as const;
type Locale = (typeof LOCALES)[number];
type Localized = Record<Locale, Record<string, unknown>>;
type Id = number | string;

const CONTENT: CollectionSlug[] = ["posts", "case-studies", "services", "technologies", "team", "clients"];
const context = { disableRevalidate: true };
const published = { status: "published" };

const payload = await getPayload({ config });

const perLocale = (pick: (locale: Locale) => Record<string, unknown>) =>
  Object.fromEntries(LOCALES.map((locale) => [locale, pick(locale)])) as Localized;

async function createLocalized(collection: CollectionSlug, base: Record<string, unknown>, localized: Localized): Promise<Id> {
  const doc = await payload.create({ collection, locale: "ro", data: { ...base, ...localized.ro } as never, context });
  for (const locale of ["en", "ru"] as const) {
    await payload.update({ collection, id: doc.id, locale, data: localized[locale] as never, context });
  }
  return doc.id;
}

async function wipeContent() {
  for (const collection of CONTENT) await payload.delete({ collection, where: { id: { exists: true } }, context });
}

async function seedServices() {
  const ids: Record<string, Id> = {};
  for (const service of services) {
    ids[service.base.icon] = await createLocalized("services", { ...service.base, ...published }, service.l as Localized);
  }
  return { software: ids.code, security: ids.shield, intelligence: ids.search };
}

async function seedTechnologies() {
  const ids = new Map<string, Id>();
  for (const [index, [name, category, icon, note, featured]] of technologies.entries()) {
    const notes = typeof note === "string" ? { ro: note, en: note, ru: note } : note;
    const id = await createLocalized(
      "technologies",
      { name, category, icon, featured, order: index + 1 },
      perLocale((l) => ({ note: notes[l] })),
    );
    ids.set(name, id);
  }
  return ids;
}

async function seedTeam() {
  const ids: Id[] = [];
  for (const [index, member] of team.entries()) {
    const base = { name: member.name, department: member.dept, featured: member.featured, order: index + 1, ...published };
    ids.push(
      await createLocalized(
        "team",
        base,
        perLocale((l) => ({ role: member.role[l] })),
      ),
    );
  }
  return ids;
}

async function seedClients() {
  for (const [index, name] of clients.entries()) {
    await payload.create({ collection: "clients", data: { name, order: index + 1, ...published } as never, context });
  }
}

async function seedCases(serviceByDomain: Record<string, Id>, technologyIds: Map<string, Id>) {
  for (const [index, item] of cases.entries()) {
    const base = {
      domain: item.domain,
      order: index + 1,
      technologies: item.techs.map((name) => technologyIds.get(name)).filter(Boolean),
      service: serviceByDomain[item.domain],
      ...published,
    };
    const localized = perLocale((l) => ({
      ...item.l[l],
      solution: item.l[l].solution.map((text) => ({ text })),
      results: item.l[l].results.map((text) => ({ text, icon: "check" })),
    }));
    await createLocalized("case-studies", base, localized);
  }
}

async function seedPosts(teamIds: Id[]) {
  for (const post of posts) {
    const base = {
      category: post.category,
      publishedAt: new Date(post.date).toISOString(),
      author: teamIds[post.author - 1],
      ...published,
    };
    const localized = perLocale((l) => ({ ...post.l[l], body: toRichText(post.l[l].body) }));
    await createLocalized("posts", base, localized);
  }
}

async function seedGlobals() {
  const now = new Date().toISOString();
  for (const locale of LOCALES) {
    const siteSettings = { ...(locale === "ro" ? settings.base : {}), ...settings.l[locale] };
    const legalPages = {
      privacy: toRichText(legal[locale].privacy),
      terms: toRichText(legal[locale].terms),
      privacyUpdated: now,
      termsUpdated: now,
    };
    await payload.updateGlobal({ slug: "site-settings", locale, data: siteSettings as never, context });
    await payload.updateGlobal({ slug: "home", locale, data: home[locale] as never, context });
    await payload.updateGlobal({ slug: "about", locale, data: about[locale] as never, context });
    await payload.updateGlobal({ slug: "legal", locale, data: legalPages as never, context });
  }
}

await wipeContent();
const serviceByDomain = await seedServices();
const technologyIds = await seedTechnologies();
const teamIds = await seedTeam();
await seedClients();
await seedCases(serviceByDomain, technologyIds);
await seedPosts(teamIds);
await seedGlobals();
payload.logger.info("Seed complete");
process.exit(0);
