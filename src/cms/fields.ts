import type { Field, FieldHook, SelectField } from "payload";

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function slugify(input: string) {
  return [...input.toLowerCase()]
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join("")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const fillSlugFrom =
  (source: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === "string" && value.trim()) return slugify(value);
    const fallback = data?.[source];
    return typeof fallback === "string" && fallback ? slugify(fallback) : value;
  };

export const slugField = (source = "title"): Field => ({
  name: "slug",
  type: "text",
  localized: true,
  index: true,
  admin: { position: "sidebar", description: "Partea din URL, în limba curentă. Se generează din titlu dacă rămâne goală." },
  hooks: { beforeValidate: [fillSlugFrom(source)] },
});

export const statusField: Field = {
  name: "status",
  type: "select",
  required: true,
  defaultValue: "draft",
  options: [
    { label: "Publicat", value: "published" },
    { label: "Ciornă", value: "draft" },
  ],
  admin: { position: "sidebar" },
};

export const orderField: Field = {
  name: "order",
  type: "number",
  defaultValue: 100,
  admin: { position: "sidebar", description: "Ordinea de afișare, crescător." },
};

const CONTENT_ICONS = [
  "code",
  "shield",
  "layers",
  "finger",
  "search",
  "lock",
  "check",
  "users",
  "clock",
  "box",
  "badge",
  "pulse",
  "cloud",
  "grad",
  "gov",
  "bolt",
  "signal",
  "bank",
  "health",
  "building",
  "eye",
  "target",
  "spark",
  "handshake",
] as const;

export const iconField = (name = "icon"): SelectField => ({
  name,
  type: "select",
  defaultValue: "shield",
  options: CONTENT_ICONS.map((icon) => ({ label: icon, value: icon })),
});

export const textList = (name: string, label?: string): Field => ({
  name,
  label,
  type: "array",
  localized: true,
  fields: [{ name: "text", type: "text", required: true }],
});

export const sectionHeading = (name: string, label: string): Field => ({
  name,
  label,
  type: "group",
  fields: [
    { name: "kicker", type: "text", localized: true },
    { name: "title", type: "text", localized: true },
    { name: "text", type: "textarea", localized: true },
  ],
});

export const faqField: Field = {
  name: "faq",
  type: "array",
  localized: true,
  fields: [
    { name: "q", type: "text", required: true },
    { name: "a", type: "textarea", required: true },
  ],
};

export const iconCards = (name: string, maxRows?: number): Field => ({
  name,
  type: "array",
  localized: true,
  maxRows,
  fields: [iconField(), { name: "title", type: "text", required: true }, { name: "text", type: "textarea" }],
});

export const DOMAIN_OPTIONS = [
  { label: "Software", value: "software" },
  { label: "Securitate", value: "security" },
  { label: "Intelligence", value: "intelligence" },
];
