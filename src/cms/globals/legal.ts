import type { GlobalConfig } from "payload";
import { isAdmin } from "../access.ts";
import { revalidateGlobal } from "../revalidate.ts";

export const Legal: GlobalConfig = {
  slug: "legal",
  label: "Pagini legale",
  admin: { group: "Pagini" },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "privacy", type: "richText", localized: true },
    { name: "privacyUpdated", type: "date" },
    { name: "terms", type: "richText", localized: true },
    { name: "termsUpdated", type: "date" },
  ],
};
