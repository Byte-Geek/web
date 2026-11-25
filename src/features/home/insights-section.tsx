import { getTranslations } from "next-intl/server";
import { getHome, getPosts } from "@/cms/queries";
import { PostCard } from "@/components/cards/post-card";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const LATEST_POSTS = 3;

export async function InsightsSection({ locale }: { locale: Locale }) {
  const [t, home, posts] = await Promise.all([
    getTranslations({ locale, namespace: "Home" }),
    getHome(locale),
    getPosts(locale, LATEST_POSTS),
  ]);
  if (!posts.length) return null;

  return (
    <section className="section" aria-labelledby="insights-title">
      <div className="page">
        <SectionHeading id="insights-title" kicker={home.insightsHead?.kicker} title={home.insightsHead?.title}>
          <Link className="text-link text-[13.5px]" href="/insights">
            {t("allInsights")}
            <Icon name="arrow" />
          </Link>
        </SectionHeading>
        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} className="grid">
              <PostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
