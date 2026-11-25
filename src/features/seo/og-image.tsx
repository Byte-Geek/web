import "server-only";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { OG_SIZE, type OgContent } from "./og-signature";

const COLORS = { background: "#020A13", text: "#EAF4FA", muted: "#93A6B8", accent: "#18DCF8", line: "rgba(24,220,248,.22)" };
const FONT_FILES = [
  { family: "Manrope Latin", weight: 500, url: new URL("./fonts/manrope-latin-500-normal.woff", import.meta.url) },
  { family: "Manrope Latin", weight: 800, url: new URL("./fonts/manrope-latin-800-normal.woff", import.meta.url) },
  { family: "Manrope Latin Ext", weight: 500, url: new URL("./fonts/manrope-latin-ext-500-normal.woff", import.meta.url) },
  { family: "Manrope Latin Ext", weight: 800, url: new URL("./fonts/manrope-latin-ext-800-normal.woff", import.meta.url) },
  { family: "Manrope Cyrillic", weight: 500, url: new URL("./fonts/manrope-cyrillic-500-normal.woff", import.meta.url) },
  { family: "Manrope Cyrillic", weight: 800, url: new URL("./fonts/manrope-cyrillic-800-normal.woff", import.meta.url) },
] as const;

const FONT_FAMILY = [...new Set(FONT_FILES.map((font) => font.family))].join(", ");

const loadFonts = () =>
  Promise.all(
    FONT_FILES.map(async ({ family, weight, url }) => ({ name: family, weight, style: "normal" as const, data: await readFile(url) })),
  );

const titleSize = (title: string) => (title.length > 80 ? 54 : title.length > 50 ? 64 : 76);

export async function renderOgImage({ title, kicker }: OgContent, siteHost: string) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `radial-gradient(circle at 88% 18%, rgba(24,220,248,.28), transparent 42%), ${COLORS.background}`,
        color: COLORS.text,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 800 }}>
        <span style={{ color: COLORS.accent, letterSpacing: "-0.12em", transform: "skewX(-14deg)" }}>{"//"}</span>
        <span style={{ letterSpacing: "0.02em" }}>INTELLECT</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 980 }}>
        {kicker && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: COLORS.accent, fontSize: 26, fontWeight: 500 }}>
            <div style={{ width: 34, height: 3, background: COLORS.accent }} />
            {kicker}
          </div>
        )}
        <div style={{ fontSize: titleSize(title), fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}>{title}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: `1px solid ${COLORS.line}`,
          color: COLORS.muted,
          fontSize: 24,
          fontWeight: 500,
        }}
      >
        <span>Software · Cybersecurity · Intelligence</span>
        <span>{siteHost}</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
