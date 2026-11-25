import { getTranslations } from "next-intl/server";
import { getHome } from "@/cms/queries";
import { Icon } from "@/components/ui/icon";
import { ATTACK_TYPES } from "@/features/threats/attack-types";
import { getSnapshot } from "@/features/threats/snapshot";
import { ThreatMapVisual } from "@/features/threats/threat-map-visual";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatNumber } from "@/lib/format";

export async function ThreatTeaser({ locale }: { locale: Locale }) {
  const [t, home, snapshot] = await Promise.all([getTranslations({ locale, namespace: "Threat" }), getHome(locale), getSnapshot()]);

  return (
    <section className="pt-5" aria-labelledby="map-title">
      <div className="page">
        <div className="glass threat-teaser reveal">
          <div className="grid content-center gap-3 p-6">
            <p className="kicker">{home.mapHead?.kicker}</p>
            <h2 id="map-title" className="heading-1">
              {home.mapHead?.title}
            </h2>
            <p className="text-[13.5px] text-muted">{home.mapHead?.text}</p>
            <Link className="btn btn-sm mt-2 justify-self-start border-accent text-accent-text" href="/threat-map">
              {t("openMap")}
              <Icon name="ne" />
            </Link>
          </div>
          <div className="relative min-h-55">
            <ThreatMapVisual events={snapshot?.events ?? []} />
          </div>
          <div className="threat-stats">
            {snapshot ? (
              <>
                <span className="badge">Live</span>
                <p className="mt-3 text-[19px] font-bold tabular-nums">{formatNumber(snapshot.total24h, locale)}</p>
                <p className="text-[12px] text-muted">{t("last24")}</p>
                <p className={`mt-3 text-[19px] font-bold ${snapshot.deltaPercent > 0 ? "text-hot" : "text-success"}`}>
                  {snapshot.deltaPercent > 0 && "+"}
                  {formatNumber(snapshot.deltaPercent, locale)}%
                </p>
                <p className="text-[12px] text-muted">{t("vsPrev")}</p>
                <h3 className="mt-4 mb-2 text-[11px] font-bold tracking-widest uppercase">{t("split")}</h3>
                <dl className="grid gap-2 text-[12px]">
                  {ATTACK_TYPES.filter((type) => snapshot.split[type] !== undefined).map((type) => (
                    <div key={type} className="grid grid-cols-[1fr_auto] gap-x-3">
                      <dt>{t(type)}</dt>
                      <dd className="text-muted tabular-nums">{snapshot.split[type]}%</dd>
                      <span className="meter col-span-2" aria-hidden="true">
                        <span style={{ width: `${snapshot.split[type]}%`, ["--meter-color" as string]: `var(--t-${type})` }} />
                      </span>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="text-[13px] text-muted">{t("unavailable")}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
