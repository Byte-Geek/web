import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Team } from "@/cms/payload-types";
import { getAllSlugs, getPost, getPosts } from "@/cms/queries";
import { PostCard } from "@/components/cards/post-card";
import { LocalizedSlugs } from "@/components/layout/localized-slugs";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CopyButton } from "@/components/ui/copy-button";
import { JsonLd } from "@/components/ui/json-ld";
import { RichText, tableOfContents } from "@/components/ui/rich-text";
import { ogImagePath } from "@/features/seo/og-signature";
import type { Locale } from "@/i18n/routing";
import { formatDate, initials } from "@/lib/format";
import { absoluteUrl, pageMetadata, siteUrl } from "@/lib/seo";
import { organizationRef } from "@/lib/structured-data";

type Params = { locale: Locale; slug: string };
const postHref = (slug: string) => ({ pathname: "/insights/[slug]" as const, params: { slug } });
const RELATED_POSTS = 2;

export const generateStaticParams = () => getAllSlugs("posts");

export async function generateMetadata({ params }: PageProps<"/[locale]/insights/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as Params;
  const [result, t] = await Promise.all([getPost(locale, slug), getTranslations({ locale, namespace: "Insights" })]);
  if (!result) return {};
  const { doc, slugs } = result;
  return pageMetadata({
    locale,
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description || doc.excerpt,
    href: (target) => (slugs[target] ? postHref(slugs[target]) : null),
    type: "article",
    kicker: t(`cat.${doc.category}`),
    publishedTime: doc.publishedAt,
    modifiedTime: doc.updatedAt,
  });
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/insights/[slug]">) {
  const { locale, slug } = (await params) as Params;
  setRequestLocale(locale);
  const result = await getPost(locale, slug);
  if (!result) notFound();
  const { doc: post, slugs } = result;
  const [t, article, nav, common, latest] = await Promise.all([
    getTranslations({ locale, namespace: "Insights" }),
    getTranslations({ locale, namespace: "Article" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getPosts(locale, RELATED_POSTS + 1),
  ]);
  const author = typeof post.author === "object" ? (post.author as Team | null) : null;
  const currentUrl = absoluteUrl(locale, postHref(slug));
  const contents = post.body ? tableOfContents(post.body) : [];
  const related = latest.filter((item) => item.id !== post.id).slice(0, RELATED_POSTS);

  return (
    <>
      <LocalizedSlugs slugs={slugs} />
      <JsonLd
        data={{
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          inLanguage: locale,
          mainEntityOfPage: currentUrl,
          image: siteUrl() + ogImagePath({ title: post.title, kicker: t(`cat.${post.category}`) }),
          articleSection: t(`cat.${post.category}`),
          author: author ? { "@type": "Person", name: author.name, jobTitle: author.role, worksFor: organizationRef() } : organizationRef(),
          publisher: organizationRef(),
        }}
      />
      <article aria-labelledby="page-title">
        <header className="page-hero">
          <div className="page">
            <Breadcrumbs
              locale={locale}
              items={[{ label: nav("insights"), href: "/insights" }, { label: post.title }]}
              currentUrl={currentUrl}
            />
            <span className="tag">{t(`cat.${post.category}`)}</span>
            <h1 id="page-title" className="heading-1 mt-3.5 max-w-[24ch]">
              {post.title}
            </h1>
            <p className="lead mt-4">{post.excerpt}</p>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              {author && (
                <span className="flex items-center gap-3">
                  <span className="icon-box rounded-full font-extrabold" aria-hidden="true">
                    {initials(author.name)}
                  </span>
                  <span>
                    <b className="block text-[15px]">{author.name}</b>
                    <span className="label">{author.role}</span>
                  </span>
                </span>
              )}
              <span className="label">
                {article("published")} <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
                {post.readingTime && ` · ${common("minRead", { n: post.readingTime })}`}
              </span>
            </div>
          </div>
        </header>

        <div className="page grid gap-10 pt-12 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="grid content-start gap-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            {contents.length > 1 && (
              <nav aria-label={article("contents")} className="grid gap-1">
                <span className="label mb-2">{article("contents")}</span>
                {contents.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="border-l-2 border-line py-1.5 pl-3 text-[15px] text-muted no-underline hover:border-accent hover:text-text"
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            )}
            <div>
              <span className="label mb-2 block">{article("share")}</span>
              <CopyButton text={currentUrl} label={article("copyLink")} />
            </div>
          </aside>
          <div className="prose">{post.body && <RichText content={post.body} withAnchors />}</div>
        </div>
      </article>

      {!!related.length && (
        <section className="section" aria-labelledby="related-title">
          <div className="page">
            <h2 id="related-title" className="kicker">
              {article("related")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <PostCard key={item.id} post={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
