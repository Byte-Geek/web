import type { CollectionConfig } from "payload";
import { adminOnly } from "../access.ts";
import { DOMAIN_OPTIONS, iconField, orderField, slugField, statusField, textList } from "../fields.ts";
import { revalidateHooks } from "../revalidate.ts";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Studiu de caz", plural: "Studii de caz" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "domain", "status"], group: "Conținut" },
  access: adminOnly,
  hooks: revalidateHooks,
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    statusField,
    orderField,
    { name: "domain", type: "select", required: true, options: DOMAIN_OPTIONS, admin: { position: "sidebar" } },
    { name: "summary", type: "textarea", localized: true, required: true },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "client", type: "text", localized: true, admin: { description: "Descriere anonimă dacă clientul nu poate fi numit." } },
    { name: "sector", type: "text", localized: true },
    { name: "period", type: "text", localized: true },
    { name: "context", type: "textarea", localized: true },
    { name: "challenge", type: "textarea", localized: true },
    textList("solution"),
    {
      name: "results",
      type: "array",
      localized: true,
      admin: { description: "Doar rezultate verificabile." },
      fields: [iconField(), { name: "text", type: "text", required: true }],
    },
    { name: "technologies", type: "relationship", relationTo: "technologies", hasMany: true },
    { name: "service", type: "relationship", relationTo: "services" },
  ],
};
