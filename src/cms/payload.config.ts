import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { collections } from "./collections/index.ts";
import { globals } from "./globals/index.ts";
import { syncThreats } from "./jobs/sync-threats.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const MAX_UPLOAD_BYTES = 8_000_000;

if (!process.env.PAYLOAD_SECRET) throw new Error("PAYLOAD_SECRET is not set");

type SeoSource = { title?: string; summary?: string; excerpt?: string };

export default buildConfig({
  admin: {
    user: "users",
    meta: { titleSuffix: " · INTELLECT CMS" },
    importMap: { baseDir: path.resolve(dirname, "..") },
  },
  collections,
  globals,
  jobs: {
    tasks: [syncThreats],
    // Needs a long-running server (the VPS), not serverless.
    autoRun: [{ cron: "0 * * * * *", queue: "threats" }],
    deleteJobOnComplete: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || "file:./data/intellect.db" } }),
  localization: {
    locales: [
      { code: "ro", label: "Română" },
      { code: "en", label: "English" },
      { code: "ru", label: "Русский" },
    ],
    defaultLocale: "ro",
    fallback: false,
  },
  i18n: { fallbackLanguage: "en" },
  graphQL: { disable: true },
  sharp,
  upload: { limits: { fileSize: MAX_UPLOAD_BYTES } },
  serverURL: siteUrl,
  csrf: [siteUrl],
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  plugins: [
    seoPlugin({
      collections: ["services", "posts", "case-studies"],
      globals: ["home", "about"],
      uploadsCollection: "media",
      tabbedUI: false,
      fields: ({ defaultFields }) =>
        defaultFields.map((field) => ("name" in field && field.name !== "preview" ? { ...field, localized: true } : field)),
      generateTitle: ({ doc }) => (doc as SeoSource).title ?? "",
      generateDescription: ({ doc }) => (doc as SeoSource).summary ?? (doc as SeoSource).excerpt ?? "",
    }),
  ],
});
