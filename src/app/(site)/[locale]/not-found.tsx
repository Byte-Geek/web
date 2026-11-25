import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/threat-map", key: "map" },
  { href: "/contact", key: "contact" },
] as const;

export default function NotFound() {
  const t = useTranslations("NotFound");
  const nav = useTranslations("Nav");

  return (
    <section className="page-hero min-h-[70vh]" aria-labelledby="page-title">
      <div className="page">
        <p className="accent-glow text-[clamp(96px,18vw,220px)] leading-none font-extrabold tracking-tighter" aria-hidden="true">
          404
        </p>
        <h1 id="page-title" className="heading-1 mt-2">
          {t("title")}
        </h1>
        <p className="lead mt-4">{t("lead")}</p>
        <p className="label mt-6">› {t("log", { path: "…" })}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((link) => (
            <li key={link.href} className="grid">
              <Link className="glass flex min-h-14 items-center justify-between px-4 font-bold" href={link.href}>
                {link.key === "home" ? t("home") : nav(link.key)}
                <Icon name="arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
