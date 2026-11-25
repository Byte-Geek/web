import type { CollectionConfig } from "payload";
import { anyone, isAdmin } from "../access.ts";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Imagine", plural: "Imagini" },
  admin: { group: "Sistem" },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  upload: {
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/avif", "image/svg+xml"],
    imageSizes: [
      { name: "thumb", width: 480 },
      { name: "card", width: 960 },
      { name: "wide", width: 1600 },
    ],
    formatOptions: { format: "webp", options: { quality: 82 } },
  },
  fields: [{ name: "alt", type: "text", localized: true, required: true }],
};
