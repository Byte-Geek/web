import { getTranslations } from "next-intl/server";
import { getHome } from "@/cms/queries";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Icon } from "./icon";

export async function CtaSection({ locale }: { locale: Locale }) {
  const [common, home] = await Promise.all([getTranslations({ locale, namespace: "Common" }), getHome(locale)]);

  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="page">
        <BackgroundPaths className="glass cta-panel reveal" count={24} speed={0.8} angle={-14}>
          <h2 id="cta-title" className="heading-1 max-w-[18ch]">
            {home.cta?.title} <span className="text-accent-text">{home.cta?.accent}</span>
          </h2>
          {home.cta?.text && <p className="text-[13.5px] text-muted">{home.cta.text}</p>}
          <div className="justify-self-start md:justify-self-end">
            <Link className="btn btn-accent btn-sm" href="/contact">
              {common("cta")}
              <Icon name="ne" />
            </Link>
          </div>
        </BackgroundPaths>
      </div>
    </section>
  );
}
