import type { MetadataRoute } from "next";
import { THEME_COLORS } from "@/components/layout/theme";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} · Intellect Security`,
    short_name: SITE_NAME,
    description: "Software, cybersecurity and intelligence for institutions and companies in Moldova, Romania and Europe.",
    start_url: `/${routing.defaultLocale}`,
    display: "browser",
    background_color: THEME_COLORS.dark,
    theme_color: THEME_COLORS.dark,
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
