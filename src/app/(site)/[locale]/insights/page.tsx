import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPosts, getSettings } from "@/cms/queries";
import { PostCard } from "@/components/cards/post-card";
import { FilterGrid } from "@/components/ui/filter-grid";
import { PageHero } from "@/components/ui/page-hero";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { POST_CATEGORIES } from "@/lib/taxonomy";

export async function generateMetadata({ params }: PageProps<"/[locale]/insights">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "Insights" });
  return pageMetadata({ locale, title: t("metaTitle"), description: t("lead"), href: "/insights", kicker: t("kicker") });
}

export default async function InsightsPage({ params }: PageProps<"/[locale]/insights">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, nav, posts, settings] = await Promise.all([
    getTranslations({ locale, namespace: "Insights" }),
    getTranslations({ locale, namespace: "Nav" }),
    getPosts(locale),
    getSettings(locale),
  ]);

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("insights") }]}
        currentUrl={absoluteUrl(locale, "/insights")}
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        image={mediaUrl(settings.heroImages?.insights) ?? "/images/hero/insights.webp"}
      />
      <section aria-label={t("title")}>
        <div className="page">
          <FilterGrid
            label={t("filter")}
            filters={POST_CATEGORIES.map((id) => ({ id, label: t(`cat.${id}`) }))}
            gridClassName="news-grid"
            emptyText={t("empty")}
            items={posts.map((post) => ({
              key: post.id,
              category: post.category,
              node: <PostCard post={post} locale={locale} layout="stack" />,
            }))}
          />
        </div>
      </section>
    </>
  );
}
