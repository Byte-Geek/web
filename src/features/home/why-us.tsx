import { getHome } from "@/cms/queries";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { Icon } from "@/components/ui/icon";
import type { Locale } from "@/i18n/routing";

export async function WhyUs({ locale }: { locale: Locale }) {
  const home = await getHome(locale);
  return (
    <section className="section" aria-labelledby="why-title">
      <BackgroundPaths className="why-band" count={30} speed={0.6} angle={-6}>
        <div className="page">
          {home.whyHead?.kicker && <p className="kicker">{home.whyHead.kicker}</p>}
          <h2 id="why-title" className="heading-1 mb-10">
            {home.whyHead?.title}
          </h2>
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {home.why?.map((claim) => (
              <li key={claim.id} className="flex gap-4">
                <Icon name={claim.icon} className="icon size-7 shrink-0" />
                <div>
                  <h3 className="text-[16px] font-bold">{claim.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{claim.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </BackgroundPaths>
    </section>
  );
}
