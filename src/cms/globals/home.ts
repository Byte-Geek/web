import type { GlobalConfig } from "payload";
import { isAdmin } from "../access.ts";
import { faqField, iconCards, iconField, sectionHeading, textList } from "../fields.ts";
import { revalidateGlobal } from "../revalidate.ts";

export const Home: GlobalConfig = {
  slug: "home",
  label: "Acasă",
  admin: { group: "Pagini" },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            textList("eyebrow", "Etichete deasupra titlului"),
            { name: "title", type: "text", localized: true, required: true },
            { name: "titleAccent", type: "text", localized: true },
            { name: "lead", type: "textarea", localized: true },
            {
              name: "kpis",
              type: "array",
              localized: true,
              maxRows: 4,
              fields: [
                iconField(),
                { name: "value", type: "number", admin: { description: "Gol: în loc de cifră apare textul din „suffix”." } },
                { name: "suffix", type: "text" },
                { name: "label", type: "text", required: true },
                { name: "isYear", type: "checkbox" },
              ],
            },
          ],
        },
        { label: "Hartă", fields: [sectionHeading("mapHead", "Teaser hartă")] },
        { label: "Servicii", fields: [sectionHeading("servicesHead", "Servicii")] },
        { label: "Tehnologii", fields: [sectionHeading("techHead", "Tehnologii")] },
        { label: "De ce noi", fields: [sectionHeading("whyHead", "De ce noi"), iconCards("why", 6)] },
        {
          label: "Proces",
          fields: [
            sectionHeading("processHead", "Proces"),
            {
              name: "process",
              type: "array",
              localized: true,
              maxRows: 6,
              fields: [{ name: "title", type: "text", required: true }, { name: "text", type: "textarea" }, textList("points")],
            },
          ],
        },
        { label: "Clienți", fields: [sectionHeading("clientsHead", "Clienți")] },
        {
          label: "Despre",
          fields: [
            sectionHeading("aboutHead", "Despre"),
            { name: "aboutLead", type: "textarea", localized: true },
            { name: "aboutText", type: "textarea", localized: true },
          ],
        },
        { label: "Articole", fields: [sectionHeading("insightsHead", "Articole")] },
        { label: "FAQ", fields: [sectionHeading("faqHead", "FAQ"), faqField] },
        {
          label: "CTA",
          fields: [
            {
              name: "cta",
              type: "group",
              fields: [
                { name: "title", type: "text", localized: true },
                { name: "accent", type: "text", localized: true },
                { name: "text", type: "textarea", localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
