import { LOCALE_META, type Locale } from "@/i18n/routing";

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(LOCALE_META[locale].bcp47, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));

export const formatNumber = (value: number, locale: Locale) => value.toLocaleString(LOCALE_META[locale].bcp47);

export const countryName = (code: string, locale: Locale) => new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;

export const mediaUrl = (media: unknown) => (media && typeof media === "object" && "url" in media ? (media.url as string | null) : null);
