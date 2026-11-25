import type { CollectionConfig } from "payload";
import { adminOnly } from "../access.ts";
import { orderField, statusField } from "../fields.ts";
import { revalidateHooks } from "../revalidate.ts";

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clienți (logouri)" },
  admin: { useAsTitle: "name", group: "Conținut", description: "Publică doar clienții care au acceptat să fie numiți." },
  access: adminOnly,
  hooks: revalidateHooks,
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "sector", type: "text", localized: true },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "url", type: "text" },
    statusField,
    orderField,
  ],
};
