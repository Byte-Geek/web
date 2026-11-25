"use client";

import { geoInterpolate, geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldTopologyData from "world-atlas/land-110m.json";
import type { AttackType } from "./attack-types";
import { COUNTRY_CENTROIDS, type LonLat } from "./geo";
import type { ThreatEvent } from "./snapshot";
import { type EventEnds, eventEnds, readTypeColors } from "./sphere";

const land = feature(worldTopologyData as unknown as Topology<{ land: GeometryCollection }>, "land");

const ROUTE_MS = 4_800;
const SPAWN_MS = 400;
const MAX_ROUTES = 10;

type ActiveRoute = EventEnds & { startedAt: number };
type Hotspot = { at: LonLat; intensity: number };

function hotspotsFor(events: ThreatEvent[]): Hotspot[] {
  const counts = new Map<string, number>();
  for (const event of events) for (const code of [event.from, event.to]) counts.set(code, (counts.get(code) ?? 0) + 1);
  const max = Math.max(1, ...counts.values());
  return [...counts]
    .filter(([code]) => COUNTRY_CENTROIDS[code])
    .map(([code, count]) => ({ at: COUNTRY_CENTROIDS[code], intensity: 0.4 + (0.6 * count) / max }));
}

let staticMap: { canvas: HTMLCanvasElement; key: string } | null = null;

function getStaticMap(width: number, height: number, dpr: number, projection: GeoProjection) {
  const key = `${Math.round(width * dpr)}x${Math.round(height * dpr)}`;
  if (staticMap?.key === key) return staticMap.canvas;

  const mask = document.createElement("canvas");
  mask.width = Math.round(width);
  mask.height = Math.round(height);
  const maskContext = mask.getContext("2d", { willReadFrequently: true });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const context = canvas.getContext("2d");
  if (!maskContext || !context) return canvas;

  maskContext.beginPath();
  geoPath(projection, maskContext)(land);
  maskContext.fillStyle = "#fff";
  maskContext.fill();
  const maskData = maskContext.getImageData(0, 0, mask.width, mask.height).data;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  const dotSpacing = Math.max(3.5, width / 220);
  const dotRadius = dotSpacing * 0.28;
  context.fillStyle = "rgba(20, 60, 100, 0.55)";
  for (let py = 0; py < height; py += dotSpacing) {
    for (let px = 0; px < width; px += dotSpacing) {
      const mx = Math.min(Math.round(px), mask.width - 1);
      const my = Math.min(Math.round(py), mask.height - 1);
      if (maskData[(my * mask.width + mx) * 4 + 3] < 128) continue;
      context.beginPath();
      context.arc(Math.round(px), Math.round(py), dotRadius, 0, Math.PI * 2);
      context.fill();
    }
  }

  const path = geoPath(projection, context);
  context.beginPath();
  path(land);
  context.fillStyle = "rgba(8, 30, 50, 0.6)";
  context.fill();
  context.strokeStyle = "rgba(30, 70, 110, 0.4)";
  context.lineWidth = 0.5;
  context.stroke();

  staticMap = { canvas, key };
  return canvas;
}

function strokeUntil(context: CanvasRenderingContext2D, points: ([number, number] | null)[], from: number, to: number, head: [number, number] | null, width: number) {
  context.beginPath();
  let previous: [number, number] | null = null;
  for (let index = from; index <= to; index += 1) {
    const point = points[index];
    if (point && previous && Math.abs(point[0] - previous[0]) <= width / 2) context.lineTo(point[0], point[1]);
    else if (point) context.moveTo(point[0], point[1]);
    previous = point;
  }
  if (head && previous && Math.abs(head[0] - previous[0]) <= width / 2) context.lineTo(head[0], head[1]);
  context.stroke();
}

function drawMap(
  canvas: HTMLCanvasElement,
  timestamp: number,
  reducedMotion: boolean,
  routes: ActiveRoute[],
  hotspots: Hotspot[],
  colors: Record<AttackType, string>,
) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(bounds.width, 1);
  const height = Math.max(bounds.height, 1);
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const projection = geoNaturalEarth1()
    .scale(Math.min(width / 5.2, Math.max(height - 12, 1) / 2.5) * 1.06)
    .translate([width / 2, height / 2]);
  context.drawImage(getStaticMap(width, height, dpr, projection), 0, 0, width, height);
  const now = reducedMotion ? 0 : timestamp;

  for (const route of routes) {
    const color = colors[route.type];
    const interpolate = geoInterpolate(route.from, route.to);
    const source = projection(route.from);
    const destination = projection(route.to);
    if (!source || !destination) continue;
    const points = Array.from({ length: 49 }, (_, index) => projection(interpolate(index / 48)));
    const progress = reducedMotion ? 0.6 : Math.max(0, Math.min(1, (timestamp - route.startedAt) / ROUTE_MS));
    const headIndex = Math.floor(progress * (points.length - 1));
    const head = projection(interpolate(progress));

    context.strokeStyle = color;
    context.globalAlpha = 0.16;
    context.lineWidth = 1;
    strokeUntil(context, points, 0, headIndex, head, width);

    context.globalAlpha = 0.9;
    context.lineWidth = 1.8;
    context.shadowColor = color;
    context.shadowBlur = 5;
    strokeUntil(context, points, Math.max(0, Math.floor((progress - 0.32) * (points.length - 1))), headIndex, head, width);
    context.globalAlpha = 1;

    if (head) {
      context.shadowBlur = 10;
      context.fillStyle = color;
      context.beginPath();
      context.arc(head[0], head[1], 2.4, 0, Math.PI * 2);
      context.fill();
    }
    context.shadowBlur = 0;

    for (const [point, isDestination] of [
      [source, false],
      [destination, true],
    ] as const) {
      context.beginPath();
      context.arc(point[0], point[1], 1.8, 0, Math.PI * 2);
      context.fillStyle = "#071725";
      context.fill();
      context.globalAlpha = 0.9;
      context.lineWidth = 1;
      context.stroke();
      const pulse = isDestination ? Math.max(0, (progress - 0.88) / 0.12) : progress < 0.22 ? progress / 0.22 : -1;
      if (pulse >= 0 && !reducedMotion) {
        context.globalAlpha = 1 - pulse;
        context.beginPath();
        context.arc(point[0], point[1], 3 + pulse * 10, 0, Math.PI * 2);
        context.stroke();
      }
      context.globalAlpha = 1;
    }
  }

  for (const spot of hotspots) {
    const point = projection(spot.at);
    if (!point) continue;
    const pulse = reducedMotion ? 0.8 : 0.6 + 0.4 * Math.sin(now / 800 + spot.at[1] * 0.1 + spot.at[0] * 0.05);
    const radius = (2 + spot.intensity * 3.5) * (0.85 + 0.15 * pulse);

    const gradient = context.createRadialGradient(point[0], point[1], 0, point[0], point[1], radius * 4);
    gradient.addColorStop(0, `rgba(255, 50, 50, ${0.5 * spot.intensity * pulse})`);
    gradient.addColorStop(0.3, `rgba(255, 30, 30, ${0.25 * spot.intensity * pulse})`);
    gradient.addColorStop(1, "rgba(255, 20, 20, 0)");
    context.beginPath();
    context.arc(point[0], point[1], radius * 4, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();

    context.beginPath();
    context.arc(point[0], point[1], radius * 0.7, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 80, 60, ${0.7 + 0.3 * pulse})`;
    context.shadowColor = "rgba(255, 50, 40, 0.9)";
    context.shadowBlur = 10 * spot.intensity;
    context.fill();
    context.shadowBlur = 0;

    context.beginPath();
    context.arc(point[0], point[1], radius * 0.35, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 180, 140, ${0.6 + 0.4 * pulse})`;
    context.fill();

    if (!reducedMotion) {
      const ringPhase = (((now / 2000 + spot.at[1] * 0.02) % 1) + 1) % 1;
      const ringAlpha = (1 - ringPhase) * 0.3 * spot.intensity;
      if (ringAlpha > 0.02) {
        context.beginPath();
        context.arc(point[0], point[1], radius * (1 + ringPhase * 4), 0, Math.PI * 2);
        context.strokeStyle = `rgba(255, 60, 50, ${ringAlpha})`;
        context.lineWidth = 0.6;
        context.stroke();
      }
    }
  }
}

export function ThreatMapVisual({ events }: { events: ThreatEvent[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readTypeColors(canvas);
    let routes: ActiveRoute[] = [];
    let hotspots: Hotspot[] = [];
    let shownEvents: ThreatEvent[] = [];
    let frameId = 0;
    let eventTimer: number | undefined;
    let isVisible = false;
    let eventIndex = 0;

    const render = (timestamp: number) => {
      frameId = 0;
      if (!isVisible) return;
      if (shownEvents !== eventsRef.current) {
        shownEvents = eventsRef.current;
        hotspots = hotspotsFor(shownEvents);
        routes = routes.filter((route) => shownEvents.some((event) => event.type === route.type));
      }
      routes = routes.filter((route) => timestamp - route.startedAt <= ROUTE_MS);
      drawMap(canvas, timestamp, reducedMotion, routes, hotspots, colors);
      if (!reducedMotion) frameId = requestAnimationFrame(render);
    };

    const addEvent = () => {
      const list = eventsRef.current;
      if (!list.length) return;
      const ends = eventEnds(list[eventIndex++ % list.length]);
      if (ends) routes = [...routes, { ...ends, startedAt: performance.now() }].slice(-MAX_ROUTES);
      if (reducedMotion && isVisible) render(performance.now());
    };

    const onThemeChange = () => (colors = readTypeColors(canvas));
    const resizeObserver = new ResizeObserver(() => {
      if (isVisible && reducedMotion) render(performance.now());
    });
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (reducedMotion) render(performance.now());
        else if (!frameId) frameId = requestAnimationFrame(render);
        if (eventTimer === undefined) {
          addEvent();
          eventTimer = window.setInterval(addEvent, reducedMotion ? SPAWN_MS * 10 : SPAWN_MS);
        }
      } else {
        cancelAnimationFrame(frameId);
        frameId = 0;
        clearInterval(eventTimer);
        eventTimer = undefined;
      }
    });
    intersectionObserver.observe(canvas);
    window.addEventListener("themechange", onThemeChange);

    return () => {
      clearInterval(eventTimer);
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("themechange", onThemeChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="fill-canvas" aria-hidden="true" />;
}
