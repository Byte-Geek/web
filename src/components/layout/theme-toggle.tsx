"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { Icon } from "../ui/icon";
import { applyTheme, type Theme } from "./theme";

const subscribe = (onChange: () => void) => {
  window.addEventListener("themechange", onChange);
  return () => window.removeEventListener("themechange", onChange);
};

const currentTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const useTheme = () => useSyncExternalStore(subscribe, currentTheme, () => "dark" as Theme);

const THEME_OPTIONS = [
  { theme: "dark", icon: "moon", label: "themeDark" },
  { theme: "light", icon: "sun", label: "themeLight" },
] as const;

export function ThemeSwitch() {
  const t = useTranslations("Nav");
  const theme = useTheme();

  return (
    <div className="switch" role="group" aria-label={t("theme")}>
      {THEME_OPTIONS.map((option) => (
        <button key={option.theme} type="button" aria-pressed={theme === option.theme} onClick={() => applyTheme(option.theme)}>
          <Icon name={option.icon} className="" />
          {t(option.label)}
        </button>
      ))}
    </div>
  );
}
