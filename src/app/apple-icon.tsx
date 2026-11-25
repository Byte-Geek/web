import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BAR = { width: 20, height: 100, background: "#18DCF8", borderRadius: 3, transform: "skewX(-14deg)" };

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        background: "#020A13",
      }}
    >
      <div style={BAR} />
      <div style={BAR} />
    </div>,
    size,
  );
}
