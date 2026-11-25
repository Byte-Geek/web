import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

type PageHeroProps = {
  locale: Locale;
  crumbs: Crumb[];
  currentUrl?: string;
  kicker?: string | null;
  title: ReactNode;
  lead?: string | null;
  actions?: ReactNode;
  image?: string | null;
};

// Breadcrumbs only show on detail pages (two or more levels), as in the design.
// Static fallbacks in /public/images may not be added yet; skip them instead of rendering a broken image.
const isAvailable = (src: string) => !src.startsWith("/images/") || existsSync(join(process.cwd(), "public", src));

export function PageHero({ locale, crumbs, currentUrl, kicker, title, lead, actions, image }: PageHeroProps) {
  const picture = image && isAvailable(image) ? image : null;
  return (
    <section className="page-hero" aria-labelledby="page-title">
      {picture && (
        <div className="page-hero-image">
          <Image src={picture} alt="" fill priority sizes="(min-width: 980px) 60vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="page">
        <div>
          {crumbs.length > 1 && <Breadcrumbs locale={locale} items={crumbs} currentUrl={currentUrl} />}
          {kicker && <p className="kicker">{kicker}</p>}
          <h1 id="page-title" className="heading-1 max-w-[22ch]">
            {title}
          </h1>
          {lead && <p className="lead mt-3">{lead}</p>}
          {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
