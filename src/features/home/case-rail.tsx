"use client";

import { useTranslations } from "next-intl";
import { Children, isValidElement, type ReactNode, useRef, useState } from "react";
import { useMomentumRail } from "@/components/kokonutui/momentum-rail";
import { Icon } from "@/components/ui/icon";


export function CaseRail({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  const t = useTranslations("Common");
  const scroller = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const { goTo, currentIndex } = useMomentumRail(scroller, track, setActive);
  const items = Children.toArray(children);

  return (
    <section className="section" aria-labelledby="cases-title">
      <div className="page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="kicker">{kicker}</p>
            <h2 id="cases-title" className="heading-1 reveal">
              {title}
            </h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              className="icon-button aria-disabled:opacity-40"
              aria-label={t("back")}
              aria-disabled={active === 0}
              onClick={() => goTo(currentIndex() - 1)}
            >
              <Icon name="arrow" className="rotate-180" />
            </button>
            <button
              type="button"
              className="icon-button aria-disabled:opacity-40"
              aria-label={t("next")}
              aria-disabled={active >= items.length - 1}
              onClick={() => goTo(currentIndex() + 1)}
            >
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </div>
      <section ref={scroller} className="rail-scroller" aria-label={title} tabIndex={0}>
        <ul ref={track} className="rail-track">
          {items.map((item) => (
            <li key={isValidElement(item) ? item.key : null} className="rail-card">
              <div className="rail-tilt grid h-full">{item}</div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
