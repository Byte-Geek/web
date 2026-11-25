import { getTranslations } from "next-intl/server";
import { getHome } from "@/cms/queries";
import { Counter } from "@/components/ui/counter";
import { Icon } from "@/components/ui/icon";
import { SweepGlitch } from "@/features/home/sweep-glitch";
import { Link } from "@/i18n/navigation";
import { LOCALE_META, type Locale } from "@/i18n/routing";

/** The line artwork behind the hero (design "FINAL · V3 mobil tabletă + V1 laptop monitor"); layout in components.css. */
function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-halo" />
      {/* Laptop and up: the wide drawing, circle on the right. */}
      <div className="hero-layer hero-layer-wide" data-sweep-main>
        <i className="hero-hot" />
        <i className="hero-sweep" />
      </div>
      {/* Phone and tablet: traces with the circle cut out, mirrored to both sides, and the emblem on top. */}
      <div className="hero-layer hero-layer-cut" data-sweep-main>
        <i className="hero-sweep" />
      </div>
      <div className="hero-layer hero-layer-cut hero-layer-flip">
        <i className="hero-sweep" />
      </div>
      <div className="hero-layer hero-layer-emb">
        <i className="hero-hot" />
        <i className="hero-sweep" />
      </div>
      <div className="hero-scrim" />
    </div>
  );
}

export async function HeroSection({ locale }: { locale: Locale }) {
  const [t, home] = await Promise.all([getTranslations({ locale, namespace: "Common" }), getHome(locale)]);
  // One sentence per line, as in the design ("Securizăm." / "Construim." / "Analizăm.").
  const titleLines = (home.title ?? "").split(/(?<=\.)\s+/).filter(Boolean);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroArt />
      <div className="hero-content">
        <p className="eyebrow">
          {home.eyebrow?.map((item) => (
            <span key={item.id}>{item.text}</span>
          ))}
        </p>
        <h1 id="hero-title" className="hero-title">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <SweepGlitch text={home.titleAccent ?? ""} className="hero-accent" />
        </h1>
        <p className="hero-lead">{home.lead}</p>
        <div className="hero-actions">
          <Link className="btn btn-accent" href="/services">
            {t("ctaServices")}
          </Link>
          <Link className="btn" href="/contact">
            {t("cta")}
          </Link>
        </div>
        {!!home.kpis?.length && (
          <dl className="hero-stats">
            {home.kpis.map((figure) => (
              <div key={figure.id} className="hero-stat">
                {figure.value == null ? (
                  <>
                    <dt>{figure.suffix}</dt>
                    <dd>
                      <Icon name="shield" className="hero-stat-icon" />
                    </dd>
                  </>
                ) : (
                  <>
                    <dt>{figure.label}</dt>
                    <dd className="hero-stat-value">
                      <Counter
                        value={figure.value}
                        suffix={figure.suffix ?? ""}
                        locale={LOCALE_META[locale].bcp47}
                        isYear={Boolean(figure.isYear)}
                      />
                    </dd>
                  </>
                )}
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
