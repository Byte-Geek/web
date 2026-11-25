const THEME_STORAGE_KEY = "isec-theme";
export const THEME_COLORS = { dark: "#020A13", light: "#F2F6F9" } as const;
export type Theme = keyof typeof THEME_COLORS;

export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")d.dataset.theme=t;}catch(e){}})();`;

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  window.dispatchEvent(new Event("themechange"));
}
