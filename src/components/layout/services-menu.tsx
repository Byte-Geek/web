"use client";

import { type ReactNode, useCallback, useRef, useState } from "react";
import { Icon } from "../ui/icon";
import { NavLink } from "./nav-link";
import { useDismiss } from "./use-dismiss";

const HOVER_CLOSE_DELAY_MS = 160;

export function ServicesMenu({ label, children }: { label: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const close = useCallback(() => setIsOpen(false), []);

  useDismiss(isOpen, close, { container, trigger });

  const openOnHover = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const closeOnLeave = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") closeTimer.current = window.setTimeout(close, HOVER_CLOSE_DELAY_MS);
  };

  const closeOnFocusOut = (event: React.FocusEvent) => {
    if (!container.current?.contains(event.relatedTarget as Node)) close();
  };

  return (
    <div ref={container} className="relative" onPointerEnter={openOnHover} onPointerLeave={closeOnLeave} onBlur={closeOnFocusOut}>
      <div className="flex items-center">
        <NavLink className="nav-link pr-1" href="/services">
          {label}
        </NavLink>
        {/* Keyboard and touch users can't hover, so the chevron toggles the menu. */}
        <button
          ref={trigger}
          type="button"
          className="nav-link pr-2 pl-0 after:hidden"
          aria-label={label}
          aria-expanded={isOpen}
          aria-controls="services-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon name="down" />
        </button>
      </div>
      <div id="services-menu" className="glass dropdown-panel grid grid-cols-[1.5fr_1fr] gap-2 p-3" data-open={isOpen}>
        {children}
      </div>
    </div>
  );
}
