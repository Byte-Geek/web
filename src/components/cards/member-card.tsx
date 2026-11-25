import Image from "next/image";
import type { Team } from "@/cms/payload-types";
import { initials, mediaUrl } from "@/lib/format";
import { Icon } from "../ui/icon";

export function MemberCard({ member }: { member: Team }) {
  const photo = mediaUrl(member.photo);
  return (
    <article className="glass member-card reveal">
      {photo ? (
        <Image src={photo} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
      ) : (
        <span aria-hidden="true" className="member-initials">
          {initials(member.name)}
        </span>
      )}
      <div className="member-caption">
        <div>
          <h3 className="text-[16px] font-bold">{member.name}</h3>
          <p className="mt-0.5 text-[13.5px] text-muted">{member.role}</p>
        </div>
        {member.linkedin && (
          <a
            className="member-link"
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn: ${member.name}`}
          >
            <Icon name="linkedin" className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}
