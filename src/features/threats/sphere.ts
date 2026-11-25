import { ATTACK_TYPES, type AttackType } from "./attack-types";
import { COUNTRY_CENTROIDS, type LonLat } from "./geo";
import { LAND_MASK_B64, MASK_H, MASK_W } from "./land-mask";
import type { ThreatEvent } from "./snapshot";

export const D2R = Math.PI / 180;
export type V3 = [number, number, number];

export function ll2v(lat: number, lon: number): V3 {
  const p = lat * D2R;
  const l = lon * D2R;
  const cp = Math.cos(p);
  return [cp * Math.sin(l), Math.sin(p), cp * Math.cos(l)];
}

export function landPoints(sampleEvery = 1): Float32Array {
  const bin = atob(LAND_MASK_B64);
  const out: number[] = [];
  let pointIndex = 0;
  const sampleStride = Math.max(1, Math.floor(sampleEvery));
  for (let r = 0; r < MASK_H; r++) {
    const lat = 90 - (r + 0.5) * 1.5;
    const stride = Math.min(8, Math.max(1, Math.round(1 / Math.max(0.12, Math.cos(lat * D2R)))));
    for (let c = (r % 2) % stride; c < MASK_W; c += stride) {
      const i = r * MASK_W + c;
      if ((bin.charCodeAt(i >> 3) >> (i & 7)) & 1) {
        if (pointIndex++ % sampleStride !== 0) continue;
        const v = ll2v(lat, -180 + (c + 0.5) * 1.5);
        out.push(v[0], v[1], v[2]);
      }
    }
  }
  return new Float32Array(out);
}

export function graticule(): V3[][] {
  const lines: V3[][] = [];
  for (let la = -60; la <= 60; la += 30) {
    const line: V3[] = [];
    for (let lo = -180; lo <= 180; lo += 4) line.push(ll2v(la, lo));
    lines.push(line);
  }
  for (let lo = -180; lo < 180; lo += 30) {
    const line: V3[] = [];
    for (let la = -90; la <= 90; la += 4) line.push(ll2v(la, lo));
    lines.push(line);
  }
  return lines;
}

export type EventEnds = { type: AttackType; from: LonLat; to: LonLat };

export function eventEnds(event: ThreatEvent): EventEnds | null {
  const from = COUNTRY_CENTROIDS[event.from];
  const to = COUNTRY_CENTROIDS[event.to];
  return from && to ? { type: event.type, from, to } : null;
}

export function readTypeColors(element: Element): Record<AttackType, string> {
  const style = getComputedStyle(element);
  return Object.fromEntries(ATTACK_TYPES.map((type) => [type, style.getPropertyValue(`--t-${type}`).trim()])) as Record<AttackType, string>;
}
