import type { CollectionConfig } from "payload";
import { adminOnly } from "../access.ts";

const EIGHT_HOURS = 60 * 60 * 8;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Administrator", plural: "Administratori" },
  admin: { useAsTitle: "email", group: "Sistem" },
  auth: {
    tokenExpiration: EIGHT_HOURS,
    maxLoginAttempts: 5,
    lockTime: FIFTEEN_MINUTES_MS,
    cookies: { sameSite: "Strict", secure: process.env.NODE_ENV === "production" },
  },
  access: adminOnly,
  fields: [{ name: "name", type: "text" }],
};
