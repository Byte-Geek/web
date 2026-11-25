import type { CollectionConfig } from "payload";
import { adminOnly } from "../access.ts";
import { orderField, statusField } from "../fields.ts";
import { revalidateHooks } from "../revalidate.ts";

export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Membru", plural: "Echipa" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "role", "department", "status"], group: "Conținut" },
  access: adminOnly,
  hooks: revalidateHooks,
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", localized: true, required: true },
    {
      name: "department",
      type: "select",
      required: true,
      options: [
        { label: "Conducere", value: "leadership" },
        { label: "Inginerie", value: "engineering" },
        { label: "Securitate", value: "security" },
        { label: "Intelligence", value: "intelligence" },
        { label: "Operațiuni", value: "operations" },
      ],
    },
    { name: "photo", type: "upload", relationTo: "media" },
    { name: "linkedin", type: "text" },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { description: "Apare pe pagina principală." } },
    statusField,
    orderField,
  ],
};
