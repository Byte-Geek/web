"use client";

import type { MouseEvent } from "react";

type StaticMapProps = { label: string; lat: number; lng: number };


const openInAppleMaps = (event: MouseEvent<HTMLAnchorElement>, lat: number, lng: number) => {
  if (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent))
    event.currentTarget.href = `https://maps.apple.com/?ll=${lat},${lng}&q=INTELLECT`;
};

export function StaticMap({ label, lat, lng }: StaticMapProps) {
  return (
    <a
      className="relative block aspect-1250/800 overflow-hidden rounded-md border border-border transition-colors hover:border-accent"
      style={{
        backgroundImage: "url(/images/map.webp), radial-gradient(var(--land-dim) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 10px 10px",
      }}
      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(event) => openInAppleMaps(event, lat, lng)}
    >
      <span className="absolute right-2 bottom-1.5 text-[10px] text-muted">© OpenStreetMap</span>
    </a>
  );
}
