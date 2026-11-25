import { getTranslations } from "next-intl/server";
import { type Href, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./json-ld";

export type Crumb = { label: string; href?: Href };

export async function Breadcrumbs({ locale, items, currentUrl }: { locale: Locale; items: Crumb[]; currentUrl?: string }) {
  const t = await getTranslations({ locale, namespace: "Common" });
  const trail: Crumb[] = [{ label: t("home"), href: "/" }, ...items];
  const listItems = trail.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.label,
    item: crumb.href ? absoluteUrl(locale, crumb.href) : currentUrl,
  }));

  return (
    <nav aria-label={t("breadcrumb")}>
      <JsonLd data={{ "@type": "BreadcrumbList", itemListElement: listItems }} />
      <ol className="breadcrumbs">
        {trail.map((crumb) => (
          <li key={crumb.label}>
            {crumb.href ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span aria-current="page" className="line-clamp-1">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
