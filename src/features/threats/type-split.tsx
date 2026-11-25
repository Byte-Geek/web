import { useTranslations } from "next-intl";
import { AttackShape } from "./attack-shape";
import { ATTACK_TYPES, type AttackType } from "./attack-types";

export function TypeSplit({ split }: { split: Partial<Record<AttackType, number>> }) {
  const t = useTranslations("Threat");
  return (
    <dl className="grid gap-3.5">
      {ATTACK_TYPES.filter((type) => split[type] !== undefined).map((type) => (
        <div key={type} className="grid grid-cols-[110px_1fr_48px] items-center gap-3 text-[15px]">
          <dt className="flex items-center gap-2">
            <AttackShape type={type} />
            {t(type)}
          </dt>
          <span className="meter" aria-hidden="true">
            <span style={{ width: `${split[type]}%`, ["--meter-color" as string]: `var(--t-${type})` }} />
          </span>
          <dd className="label text-right tabular-nums">{split[type]}%</dd>
        </div>
      ))}
    </dl>
  );
}
