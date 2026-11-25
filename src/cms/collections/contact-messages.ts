import type { CollectionConfig } from "payload";
import { isAdmin, nobody } from "../access.ts";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  labels: { singular: "Mesaj", plural: "Mesaje primite" },
  admin: { useAsTitle: "subject", defaultColumns: ["name", "email", "topic", "createdAt", "handled"], group: "Mesaje" },
  access: { read: isAdmin, update: isAdmin, delete: isAdmin, create: nobody },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "company", type: "text" },
    { name: "topic", type: "text" },
    { name: "subject", type: "text" },
    { name: "message", type: "textarea", required: true },
    { name: "locale", type: "text" },
    { name: "handled", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
  ],
};
