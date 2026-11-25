import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { getSettings } from "@/cms/queries";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/components/layout/theme";
import { IconSprite } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { routing } from "@/i18n/routing";
import { SITE_NAME, siteUrl } from "@/lib/seo";
import { siteGraph } from "@/lib/structured-data";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter", display: "swap" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-plex",
  display: "swap",
  weight: ["400", "500"],
});

const CLIENT_NAMESPACES = ["Common", "Nav", "Threat", "Map", "Contact"] as const;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLORS.dark,
  colorScheme: "dark light",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t("defaultTitle"), template: `%s · ${SITE_NAME}` },
    description: t("defaultDescription"),
    applicationName: SITE_NAME,
    formatDetection: { telephone: false },
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [t, messages, settings] = await Promise.all([
    getTranslations({ locale, namespace: "Common" }),
    getMessages({ locale }),
    getSettings(locale),
  ]);
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((namespace) => [namespace, messages[namespace]]));

  return (
    <html
      lang={locale}
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Plain inline script: runs before paint to avoid a theme flash; next/script triggers React's client-script warning. */}
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <JsonLd data={siteGraph(locale, settings)} />
        <IconSprite />
        <a className="skip-link" href="#main">
          {t("skip")}
        </a>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <SiteHeader locale={locale} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
