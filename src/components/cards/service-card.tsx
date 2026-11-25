import type { Service } from "@/cms/payload-types";
import { Link } from "@/i18n/navigation";
import { Icon } from "../ui/icon";
import { ServiceWave } from "./service-wave";

type ServiceCardProps = { service: Service; cta: string; icon?: string; wave?: number };

// The home page cards carry the glowing wave and their own icons (as in the design); elsewhere plain.
export function ServiceCard({ service, cta, icon, wave }: ServiceCardProps) {
  return (
    <Link className="glass service-card" href={{ pathname: "/services/[slug]", params: { slug: service.slug ?? "" } }}>
      {wave !== undefined && <ServiceWave id={`wave-${service.id}`} variant={wave} />}
      <Icon name={icon ?? service.icon} className="icon relative size-8" />
      <h3 className="heading-3 relative mt-3">{service.title}</h3>
      <p className="relative text-[15px] leading-relaxed text-muted">{service.summary}</p>
      <span className="text-link relative mt-auto pt-4 text-[14px]">
        {cta}
        <Icon name="arrow" />
      </span>
    </Link>
  );
}
