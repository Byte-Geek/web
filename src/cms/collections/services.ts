import type { CollectionConfig } from "payload";
import { adminOnly } from "../access.ts";
import { faqField, iconCards, iconField, orderField, slugField, statusField, textList } from "../fields.ts";
import { revalidateHooks } from "../revalidate.ts";

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Serviciu", plural: "Servicii" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "kind", "status", "order"], group: "Conținut" },
  access: adminOnly,
  hooks: revalidateHooks,
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    statusField,
    orderField,
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "main",
      options: [
        { label: "Principal (are pagină)", value: "main" },
        { label: "Adițional", value: "additional" },
      ],
      admin: { position: "sidebar" },
    },
    { ...iconField(), admin: { position: "sidebar" } },
    { name: "summary", type: "textarea", localized: true, required: true },
    { name: "cover", type: "upload", relationTo: "media" },
    textList("highlights"),
    {
      type: "collapsible",
      label: "Pagina serviciului",
      admin: { condition: (data) => data?.kind === "main" },
      fields: [
        { name: "kicker", type: "text", localized: true },
        { name: "headline", type: "text", localized: true },
        { name: "intro", type: "textarea", localized: true },
        {
          name: "guarantees",
          type: "array",
          localized: true,
          maxRows: 4,
          fields: [iconField(), { name: "value", type: "text", required: true }, { name: "label", type: "text", required: true }],
        },
        iconCards("subServices"),
        textList("audience", "Pentru cine"),
        {
          name: "approach",
          type: "array",
          localized: true,
          maxRows: 4,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "text", type: "textarea", required: true },
          ],
        },
        faqField,
      ],
    },
  ],
};
