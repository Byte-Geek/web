import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getAbout, getHome, getSettings, getTeam } from "@/cms/queries";
import { MemberCard } from "@/components/cards/member-card";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { mediaUrl } from "@/lib/format";

const SHOWN_FACTS = 3;
const FEATURED_MEMBERS = 4;

export async function AboutSection({ locale }: { locale: Locale }) {
  const [t, home, about, settings, team] = await Promise.all([
    getTranslations({ locale, namespace: "Home" }),
    getHome(locale),
    getAbout(locale),
    getSettings(locale),
    getTeam(locale),
  ]);
  const image = mediaUrl(settings.heroImages?.about);
  const featured = team.filter((member) => member.featured).slice(0, FEATURED_MEMBERS);

  return (
    <>
      <section className="section" aria-labelledby="about-title">
        <div className="page">
          <div className="glass about-card reveal">
            <div className="media-card-image">{image && <Image src={image} alt="" fill sizes="300px" className="object-cover" />}</div>
            <div className="grid content-center gap-3 p-8 lg:p-10">
              <p className="kicker">{home.aboutHead?.kicker}</p>
              <h2 id="about-title" className="heading-1">
                {home.aboutHead?.title}
              </h2>
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted">{home.aboutLead}</p>
              <Link className="text-link mt-1 text-[14px]" href="/about">
                {t("storyLink")}
                <Icon name="arrow" />
              </Link>
            </div>
            <dl className="about-facts">
              {about.facts?.slice(0, SHOWN_FACTS).map((fact) => (
                <div key={fact.id} className="flex flex-col-reverse text-center">
                  <dt className="mt-1 text-[13px] text-muted">{fact.label}</dt>
                  <dd className="text-[24px] font-bold tabular-nums">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section" aria-labelledby="team-title">
          <div className="page">
            {about.teamHead?.kicker && <p className="kicker">{about.teamHead.kicker}</p>}
            <h2 id="team-title" className="heading-1 mb-8">
              {about.teamHead?.title}
            </h2>
            <ul className="grid grid-cols-2 gap-5 lg:grid-cols-5">
              {featured.map((member) => (
                <li key={member.id} className="grid">
                  <MemberCard member={member} />
                </li>
              ))}
              <li className="glass reveal col-span-2 grid content-center gap-3 p-5 lg:col-span-1">
                <Icon name="users" className="icon size-7" />
                <p className="text-[14px] leading-relaxed text-muted">{about.teamHead?.text}</p>
                <Link className="text-link text-[13.5px]" href="/team">
                  {t("teamLink")}
                  <Icon name="arrow" />
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
