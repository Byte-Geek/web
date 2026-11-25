"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useId, useState } from "react";
import { SlidingPill } from "@/components/kokonutui/sliding-pill";

type FilterItem = { key: string | number; category: string; node: ReactNode };

type FilterGridProps = {
  label: string;
  filters: { id: string; label: string }[];
  items: FilterItem[];
  gridClassName: string;
  emptyText: string;
};

const ALL = "all";

export function FilterGrid({ label, filters, items, gridClassName, emptyText }: FilterGridProps) {
  const t = useTranslations("Common");
  const [active, setActive] = useState(ALL);
  const pillId = useId();
  const countOf = (id: string) => (id === ALL ? items.length : items.filter((item) => item.category === id).length);
  const visible = active === ALL ? items : items.filter((item) => item.category === active);
  const options = [{ id: ALL, label: t("all") }, ...filters.filter((filter) => countOf(filter.id) > 0)];

  return (
    <>
      <div role="group" aria-label={label} className="pill-group mb-6 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="filter-button"
            data-pill-item
            aria-pressed={active === option.id}
            onClick={() => setActive(option.id)}
          >
            {active === option.id && <SlidingPill id={pillId} />}
            {option.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {t("shown", { count: visible.length })}
      </p>
      {visible.length ? (
        <ul className={gridClassName}>
          {visible.map((item) => (
            <li key={item.key} className="grid">
              {item.node}
            </li>
          ))}
        </ul>
      ) : (
        <p className="placeholder-box p-10">{emptyText}</p>
      )}
    </>
  );
}
