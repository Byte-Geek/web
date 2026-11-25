import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { adminOnly } from "../access.ts";
import { slugField, statusField } from "../fields.ts";
import { revalidateHooks } from "../revalidate.ts";

const WORDS_PER_MINUTE = 200;
const MIN_WORDS_FOR_ESTIMATE = 40;

const estimateReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  const text = JSON.stringify(data?.body ?? "").replace(/"[a-zA-Z]+":/g, " ");
  const words = (text.match(/[\p{L}\p{N}]+/gu) ?? []).length;
  if (words > MIN_WORDS_FOR_ESTIMATE) data.readingTime = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return data;
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Articol", plural: "Articole" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "category", "publishedAt", "status"], group: "Conținut" },
  access: adminOnly,
  hooks: { ...revalidateHooks, beforeChange: [estimateReadingTime] },
  defaultSort: "-publishedAt",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    statusField,
    { name: "publishedAt", type: "date", required: true, defaultValue: () => new Date().toISOString(), admin: { position: "sidebar" } },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Securitate", value: "security" },
        { label: "Tehnologie", value: "technology" },
        { label: "Intelligence", value: "intelligence" },
        { label: "Companie", value: "company" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "author", type: "relationship", relationTo: "team", admin: { position: "sidebar" } },
    { name: "excerpt", type: "textarea", localized: true, required: true },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "body", type: "richText", localized: true },
    { name: "readingTime", type: "number", admin: { position: "sidebar", readOnly: true } },
  ],
};
