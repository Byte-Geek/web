import type { GlobalConfig } from "payload";
import { isAdmin } from "../access.ts";
import { revalidateGlobal } from "../revalidate.ts";

const SOCIAL_NETWORKS = ["linkedin", "youtube", "facebook", "telegram", "x"] as const;

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Setări site",
  admin: { group: "Setări" },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "tagline", type: "text", localized: true },
    { name: "email", type: "email", required: true },
    { name: "securityEmail", type: "email" },
    { name: "phone", type: "text" },
    { name: "address", type: "textarea", localized: true },
    { name: "hours", type: "text", localized: true },
    { name: "city", type: "text", localized: true },
    {
      name: "heroImages",
      type: "group",
      admin: { description: "Imaginea din dreapta hero-ului pe fiecare pagină. Fără imagine rămâne fundalul grafic." },
      fields: ["services", "technologies", "about", "team", "insights", "clients", "contact"].map((name) => ({
        name,
        type: "upload" as const,
        relationTo: "media" as const,
      })),
    },
    {
      name: "geo",
      type: "group",
      fields: [
        { name: "lat", type: "number" },
        { name: "lng", type: "number" },
      ],
    },
    {
      name: "social",
      type: "array",
      fields: [
        {
          name: "network",
          type: "select",
          required: true,
          options: SOCIAL_NETWORKS.map((network) => ({ label: network, value: network })),
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "pgp",
      type: "group",
      fields: [
        { name: "fingerprint", type: "text" },
        { name: "publicKey", type: "textarea" },
      ],
    },
  ],
};
