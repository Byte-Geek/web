"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../ui/icon";
import { useDismiss } from "./use-dismiss";

const DESKTOP_QUERY = "(min-width: 74rem)";
// Opens from just below full size, slightly raised and transparent; closes faster than it opens.
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const OPEN = { scale: [0.97, 1], y: [-8, 0], opacity: [0, 1], transition: { duration: 0.22, ease: EASE_OUT } };
const CLOSED = { scale: 0.97, y: -8, opacity: 0, transition: { duration: 0.15, ease: EASE_OUT } };

export function MobileMenu({ children }: { children: ReactNode }) {
  const t = useTranslations("Nav");
  const [isOpen, setIsOpen] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  useDismiss(isOpen, close, { container: panel, trigger });

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) panel.current?.querySelector<HTMLElement>("a, summary")?.focus();
  }, [isOpen]);

  useEffect(() => {
    const desktop = matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = () => desktop.matches && close();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [close]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="icon-button nav:hidden"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        aria-label={isOpen ? t("menuClose") : t("menuOpen")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon name={isOpen ? "close" : "menu"} />
      </button>
      <div className="mobile-nav-backdrop nav:hidden" data-open={isOpen} aria-hidden="true" />
      <motion.nav
        ref={panel}
        id="mobile-nav"
        className="mobile-nav nav:hidden"
        aria-label={t("mobile")}
        data-open={isOpen}
        inert={!isOpen}
        initial={false}
        style={{ transformOrigin: "top center" }}
        animate={isOpen ? OPEN : CLOSED}
      >
        {children}
      </motion.nav>
    </>
  );
}
