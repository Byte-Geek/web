import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAbout, getSettings } from "@/cms/queries";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { webPage } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const [t, about] = await Promise.all([getTranslations({ locale, namespace: "About" }), getAbout(locale)]);
  return pageMetadata({
    locale,
    title: about.meta?.title || t("metaTitle"),
    description: about.meta?.description || about.hero?.text,
    href: "/about",
    kicker: about.hero?.kicker,
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, nav, about, settings] = await Promise.all([
    getTranslations({ locale, namespace: "About" }),
    getTranslations({ locale, namespace: "Nav" }),
    getAbout(locale),
    getSettings(locale),
  ]);
  const purpose = [
    { id: "mission", icon: "target", title: t("mission"), text: about.mission },
    { id: "vision", icon: "eye", title: t("vision"), text: about.vision },
  ];

  return (
    <>
      <JsonLd data={webPage("AboutPage", absoluteUrl(locale, "/about"), t("metaTitle"), locale)} />
      <PageHero
        locale={locale}
        crumbs={[{ label: nav("about") }]}
        currentUrl={absoluteUrl(locale, "/about")}
        kicker={about.hero?.kicker}
        title={about.hero?.title}
        lead={about.hero?.text}
        image={mediaUrl(settings.heroImages?.about) ?? "/images/hero/about.webp"}
      />

      <div className="page grid gap-8">
        {!!about.facts?.length && (
          <dl className="glass stat-strip reveal">
            {about.facts.map((fact) => (
              <div key={fact.id} className="flex flex-col-reverse">
                <dt className="label">{fact.label}</dt>
                <dd className="text-[22px] font-bold tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="grid gap-5">
          {purpose.map((item) => (
            <li key={item.id} className="flex gap-3.5">
              <Icon name={item.icon} className="icon size-7" />
              <div>
                <h2 className="heading-3">{item.title}</h2>
                <p className="text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <section aria-labelledby="values-title">
          <h2 id="values-title" className="heading-2 mb-3">
            {t("valuesTitle")}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {about.values?.map((value) => (
              <li key={value.id} className="glass reveal grid justify-items-center gap-1.5 p-4 text-center">
                <Icon name={value.icon} className="icon size-7" />
                <h3 className="text-[15px] font-bold">{value.title}</h3>
                <p className="text-[13px] text-muted">{value.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="industries-title">
          <h2 id="industries-title" className="heading-2 mb-3">
            {t("industriesTitle")}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {about.industries?.map((industry) => (
              <li key={industry.id} className="glass reveal grid justify-items-center gap-2 p-3 text-center text-[12.5px] font-semibold">
                <Icon name={industry.icon} className="icon size-6" />
                {industry.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
