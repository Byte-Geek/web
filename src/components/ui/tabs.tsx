"use client";

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { SlidingPill } from "@/components/kokonutui/sliding-pill";

type Tab = { id: string; label: string; content: ReactNode };

const KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export function Tabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const [selected, setSelected] = useState(0);
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setSelected(index);
    buttons.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const count = tabs.length;
    if (event.key === "Home") select(0);
    else if (event.key === "End") select(count - 1);
    else if (event.key in KEY_STEP) select((index + KEY_STEP[event.key] + count) % count);
    else return;
    event.preventDefault();
  };

  return (
    <div className="grid gap-4">
      <div role="tablist" aria-label={label} className="pill-group flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="tab"
            className="filter-button"
            data-pill-item
            id={`${baseId}-tab-${tab.id}`}
            aria-controls={`${baseId}-panel-${tab.id}`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {index === selected && <SlidingPill id={`${baseId}-pill`} />}
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== selected}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
