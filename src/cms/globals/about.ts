import type { GlobalConfig } from "payload";
import { isAdmin } from "../access.ts";
import { iconCards, iconField, sectionHeading, textList } from "../fields.ts";
import { revalidateGlobal } from "../revalidate.ts";

export const About: GlobalConfig = {
  slug: "about",
  label: "Despre",
  admin: { group: "Pagini" },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    sectionHeading("hero", "Hero"),
    { name: "storyLead", type: "textarea", localized: true },
    { name: "story", type: "textarea", localized: true },
    {
      name: "facts",
      type: "array",
      localized: true,
      maxRows: 6,
      fields: [iconField(), { name: "value", type: "text", required: true }, { name: "label", type: "text", required: true }],
    },
    { name: "mission", type: "textarea", localized: true },
    { name: "vision", type: "textarea", localized: true },
    iconCards("values"),
    iconCards("divisions"),
    { name: "industries", type: "array", localized: true, fields: [iconField(), { name: "label", type: "text", required: true }] },
    sectionHeading("teamHead", "Echipa"),
    {
      name: "careers",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "text", type: "textarea", localized: true },
        textList("points"),
        { name: "email", type: "email" },
      ],
    },
  ],
};
