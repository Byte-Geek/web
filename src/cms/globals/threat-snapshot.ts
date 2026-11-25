import type { GlobalConfig } from "payload";
import { isAdmin } from "../access.ts";

export const ThreatSnapshot: GlobalConfig = {
  slug: "threat-snapshot",
  label: "Hartă: ultimul snapshot",
  admin: { group: "Sistem", description: "Scris automat de job-ul hărții." },
  access: { read: isAdmin, update: isAdmin },
  fields: [
    { name: "generatedAt", type: "date" },
    { name: "data", type: "json" },
    { name: "cache", type: "json", admin: { description: "Starea internă a job-ului (limite API)." } },
  ],
};
