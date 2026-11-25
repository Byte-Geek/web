import type { CollectionConfig } from "payload";
import { adminOnly } from "../access.ts";
import { iconField, orderField } from "../fields.ts";
import { revalidateHooks } from "../revalidate.ts";

export const Technologies: CollectionConfig = {
  slug: "technologies",
  labels: { singular: "Tehnologie", plural: "Tehnologii" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "category", "featured", "order"], group: "Conținut" },
  access: adminOnly,
  hooks: revalidateHooks,
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "note", type: "text", localized: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Securitate", value: "security" },
        { label: "Backend", value: "backend" },
        { label: "Frontend", value: "frontend" },
        { label: "Mobil", value: "mobile" },
        { label: "Cloud și DevOps", value: "cloud" },
        { label: "Date și AI", value: "data" },
      ],
    },
    iconField(),
    { name: "featured", type: "checkbox", defaultValue: true, admin: { description: "Nebifat: apare la „Alte tehnologii”." } },
    orderField,
  ],
};
