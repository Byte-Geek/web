import type { Technology } from "@/cms/payload-types";
import { Icon } from "../ui/icon";

export function TechnologyCard({ technology, withNote = false }: { technology: Technology; withNote?: boolean }) {
  return (
    <div className={`glass tech-card ${withNote ? "min-h-24 flex-col gap-1.5 text-center" : ""}`}>
      {withNote ? (
        <span className="grid size-10 place-items-center rounded-[10px] border border-border bg-glow-soft">
          <Icon name={technology.icon} className="icon size-5" />
        </span>
      ) : (
        <Icon name={technology.icon} className="icon size-5" />
      )}
      <span>
        {technology.name}
        {withNote && technology.note && <small className="block text-[12.5px] font-normal text-muted">{technology.note}</small>}
      </span>
    </div>
  );
}
