import Image from "next/image";
import type { Client } from "@/cms/payload-types";
import { mediaUrl } from "@/lib/format";

const MARQUEE_COPIES = 3;
const SECONDS_PER_LOGO = 5;

function LogoList({ clients, hidden }: { clients: Client[]; hidden?: boolean }) {
  return (
    <ul className="client-logos" aria-hidden={hidden || undefined}>
      {clients.map((client) => {
        const logo = mediaUrl(client.logo);
        return (
          <li key={client.id}>
            {logo ? <Image src={logo} alt={hidden ? "" : client.name} fill sizes="260px" className="object-contain p-3" /> : client.name}
          </li>
        );
      })}
    </ul>
  );
}

// Home: the logos scroll sideways in a loop; the copies after the first only fill the gap and are hidden from screen readers.
export function ClientLogos({ clients, marquee }: { clients: Client[]; marquee?: boolean }) {
  if (!marquee) return <LogoList clients={clients} />;
  return (
    <div className="client-marquee reveal" style={{ ["--marquee-duration" as string]: `${clients.length * SECONDS_PER_LOGO}s` }}>
      <div className="client-marquee-track">
        {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
          <LogoList key={copy} clients={clients} hidden={copy > 0} />
        ))}
      </div>
    </div>
  );
}
