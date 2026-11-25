"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { formatNumber } from "@/lib/format";
import type { CountryShare } from "./snapshot";

type Ranking = "sources" | "targets";


type NamedShare = CountryShare & { name: string };

export function CountryRanking({ sources, targets }: Record<Ranking, NamedShare[]>) {
  const t = useTranslations("Map");
  const locale = useLocale() as Locale;
  const baseId = useId();
  const [ranking, setRanking] = useState<Ranking>("targets");
  const rows = ranking === "sources" ? sources : targets;
  const maxPercent = Math.max(...rows.map((row) => row.percent), 1);

  return (
    <section aria-labelledby={`${baseId}-title`} className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id={`${baseId}-title`} className="label">
          {t("top")}
        </h2>
        <div className="segmented" role="tablist" aria-label={t("top")}>
          {(["targets", "sources"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              id={`${baseId}-${option}`}
              aria-controls={`${baseId}-panel`}
              aria-selected={ranking === option}
              onClick={() => setRanking(option)}
            >
              {t(option)}
            </button>
          ))}
        </div>
      </div>
      <ol id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${ranking}`} className="grid gap-2 text-[15px]">
        {rows.map((row, index) => (
          <li key={row.country} className="grid grid-cols-[28px_1fr_auto] items-center gap-x-2 gap-y-1">
            <span className="label">{String(index + 1).padStart(2, "0")}</span>
            {row.name}
            <span className="label tabular-nums">{formatNumber(row.percent, locale)}%</span>
            <span className="meter col-span-2 col-start-2" aria-hidden="true">
              <span style={{ width: `${(row.percent / maxPercent) * 100}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
