"use client";

import { useEffect, useRef } from "react";
import type { AttackType } from "./attack-types";
import type { ThreatEvent } from "./snapshot";
import { D2R, eventEnds, graticule, landPoints, ll2v, readTypeColors, type V3 } from "./sphere";

const ROUTE_POINT_COUNT = 48;
const SPAWN_MS = 400;
const MAX_ROUTES = 90;
const ZOOM_LIMITS = [0.6, 3] as const;
const WHEEL_ZOOM_STEP = 0.0015;
const TILT_LIMIT = 80 * D2R;

type VisualRoute = { points: Float32Array; start: V3; end: V3; duration: number; startedAt: number; type: AttackType };

function routePoints(start: V3, end: V3, angle: number) {
  const sinAngle = Math.sin(angle) || 1e-6;
  const liftHeight = 0.06 + 0.32 * (angle / Math.PI);
  const points = new Float32Array((ROUTE_POINT_COUNT + 1) * 3);
  for (let index = 0; index <= ROUTE_POINT_COUNT; index += 1) {
    const t = index / ROUTE_POINT_COUNT;
    const startWeight = Math.sin((1 - t) * angle) / sinAngle;
    const endWeight = Math.sin(t * angle) / sinAngle;
    const lift = 1 + liftHeight * Math.sin(Math.PI * t);
    for (let axis = 0; axis < 3; axis += 1) points[index * 3 + axis] = (startWeight * start[axis] + endWeight * end[axis]) * lift;
  }
  return points;
}

function createVisualRoute(event: ThreatEvent, startedAt: number): VisualRoute | null {
  const ends = eventEnds(event);
  if (!ends) return null;
  const start = ll2v(ends.from[1], ends.from[0]);
  const end = ll2v(ends.to[1], ends.to[0]);
  const angle = Math.acos(Math.max(-1, Math.min(1, start[0] * end[0] + start[1] * end[1] + start[2] * end[2])));
  return { points: routePoints(start, end, angle), start, end, duration: 1500 + angle * 900, startedAt, type: event.type };
}

export function ThreatGlobe({ events }: { events: ThreatEvent[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!stage || !canvas || !context) return;

    const land = landPoints(2);
    const grid = graticule();
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readTypeColors(stage);
    let routes: VisualRoute[] = [];
    let width = 0;
    let height = 0;
    let radius = 0;
    let baseRadius = 0;
    let zoom = 1;
    let dragging = false;
    const pointers = new Map<number, { x: number; y: number }>();
    let centerX = 0;
    let centerY = 0;
    let rotationY = -25 * D2R;
    let rotationX = 0.68;
    let frameId = 0;
    let eventTimer: number | undefined;
    let isVisible = false;
    let previousTime = performance.now();
    let eventIndex = 0;

    const projected = { x: 0, y: 0, z: 0 };
    const project = (x: number, y: number, z: number, cosY: number, sinY: number, cosX: number, sinX: number) => {
      const rotatedX = x * cosY + z * sinY;
      const rotatedZ = -x * sinY + z * cosY;
      const rotatedY = y * cosX - rotatedZ * sinX;
      projected.x = centerX + rotatedX * radius;
      projected.y = centerY - rotatedY * radius;
      projected.z = y * sinX + rotatedZ * cosX;
    };

    const landBuckets = Array.from({ length: 4 }, () => new Float32Array(land.length * 2));
    const landBucketLengths = new Uint32Array(4);
    const routeHead = { x: 0, y: 0 };

    const draw = (now: number) => {
      frameId = 0;
      if (!isVisible) return;
      const delta = Math.min(0.05, (now - previousTime) / 1000);
      previousTime = now;
      if (!reducedMotion && !dragging) rotationY += 0.07 * delta;
      radius = baseRadius * zoom;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      context.clearRect(0, 0, width, height);
      const halo = context.createRadialGradient(centerX, centerY, radius * 0.96, centerX, centerY, radius * 1.28);
      halo.addColorStop(0, "rgba(74, 158, 174, 0.16)");
      halo.addColorStop(1, "rgba(74, 158, 174, 0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      context.fill();

      const sphere = context.createRadialGradient(centerX - radius * 0.35, centerY - radius * 0.4, radius * 0.1, centerX, centerY, radius);
      sphere.addColorStop(0, "#0f1d2e");
      sphere.addColorStop(1, "#070d16");
      context.fillStyle = sphere;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();
      context.save();
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.clip();

      const pointSize = Math.max(1.3, radius / 240);
      landBucketLengths.fill(0);
      for (let index = 0; index < land.length; index += 3) {
        project(land[index], land[index + 1], land[index + 2], cosY, sinY, cosX, sinX);
        if (projected.z <= 0.02) continue;
        const depth = projected.z > 0.75 ? 3 : projected.z > 0.5 ? 2 : projected.z > 0.25 ? 1 : 0;
        const offset = landBucketLengths[depth];
        landBuckets[depth][offset] = projected.x;
        landBuckets[depth][offset + 1] = projected.y;
        landBucketLengths[depth] += 2;
      }
      const alphas = [0.22, 0.42, 0.62, 0.85];
      for (let bucket = 0; bucket < landBuckets.length; bucket += 1) {
        context.fillStyle = `rgba(143, 183, 207, ${alphas[bucket]})`;
        context.beginPath();
        for (let index = 0; index < landBucketLengths[bucket]; index += 2) {
          context.rect(landBuckets[bucket][index] - pointSize / 2, landBuckets[bucket][index + 1] - pointSize / 2, pointSize, pointSize);
        }
        context.fill();
      }

      context.strokeStyle = "rgba(143, 183, 207, 0.3)";
      context.lineWidth = 1.15;
      for (const line of grid) {
        let visible = false;
        context.beginPath();
        for (const point of line) {
          project(point[0], point[1], point[2], cosY, sinY, cosX, sinX);
          if (projected.z > 0) {
            if (visible) context.lineTo(projected.x, projected.y);
            else context.moveTo(projected.x, projected.y);
            visible = true;
          } else visible = false;
        }
        context.stroke();
      }

      for (const route of routes) {
        const progress = reducedMotion ? 0.6 : (now - route.startedAt) / route.duration;
        if (progress < 0 || progress > 1.7) continue;
        const color = colors[route.type];
        const head = Math.min(progress, 1);
        const headIndexFloat = head * ROUTE_POINT_COUNT;
        const headIndex = Math.floor(headIndexFloat);
        const points = route.points;
        const fade = progress > 1 ? Math.max(0, 1 - (progress - 1) / 0.7) : 1;

        context.beginPath();
        let drawing = false;
        for (let index = 0; index <= headIndex; index += 1) {
          project(points[index * 3], points[index * 3 + 1], points[index * 3 + 2], cosY, sinY, cosX, sinX);
          if (projected.z > 0) {
            if (drawing) context.lineTo(projected.x, projected.y);
            else context.moveTo(projected.x, projected.y);
            drawing = true;
          } else drawing = false;
        }
        context.strokeStyle = color;
        context.globalAlpha = 0.14 * fade;
        context.lineWidth = 1;
        context.stroke();

        const tailStart = Math.max(0, Math.floor((head - 0.32) * ROUTE_POINT_COUNT));
        let previousX = 0;
        let previousY = 0;
        let hasPrevious = false;
        context.lineWidth = 1.8;
        for (let index = tailStart; index <= headIndex + 1 && index <= ROUTE_POINT_COUNT; index += 1) {
          const offset = Math.min(index, headIndex) * 3;
          const fraction = index === headIndex + 1 ? headIndexFloat - headIndex : 0;
          const next = fraction ? offset + 3 : offset;
          project(
            points[offset] + (points[next] - points[offset]) * fraction,
            points[offset + 1] + (points[next + 1] - points[offset + 1]) * fraction,
            points[offset + 2] + (points[next + 2] - points[offset + 2]) * fraction,
            cosY,
            sinY,
            cosX,
            sinX,
          );
          if (projected.z <= 0) {
            hasPrevious = false;
            continue;
          }
          if (hasPrevious) {
            context.globalAlpha = (0.15 + (0.85 * (index - tailStart)) / Math.max(1, headIndex + 1 - tailStart)) * fade;
            context.beginPath();
            context.moveTo(previousX, previousY);
            context.lineTo(projected.x, projected.y);
            context.stroke();
          }
          previousX = projected.x;
          previousY = projected.y;
          hasPrevious = true;
          routeHead.x = projected.x;
          routeHead.y = projected.y;
        }

        context.lineWidth = 1;
        if (progress < 0.35) {
          project(route.start[0], route.start[1], route.start[2], cosY, sinY, cosX, sinX);
          if (projected.z > 0) {
            const pulse = progress / 0.35;
            context.globalAlpha = 1 - pulse;
            context.beginPath();
            context.arc(projected.x, projected.y, 20 * pulse, 0, Math.PI * 2);
            context.stroke();
          }
        }

        if (progress < 1 && hasPrevious) {
          context.globalAlpha = 1;
          context.fillStyle = color;
          context.beginPath();
          context.arc(routeHead.x, routeHead.y, 2.4, 0, Math.PI * 2);
          context.fill();
        }

        if (progress >= 1) {
          project(route.end[0], route.end[1], route.end[2], cosY, sinY, cosX, sinX);
          if (projected.z > 0) {
            const pulse = Math.min(1, (progress - 1) / 0.7);
            context.globalAlpha = (1 - pulse) * projected.z;
            context.lineWidth = 1.5;
            context.beginPath();
            context.arc(projected.x, projected.y, 3 + pulse * 16, 0, Math.PI * 2);
            context.stroke();
          }
        }
        context.globalAlpha = 1;
      }

      context.restore();
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.strokeStyle = "rgba(143, 183, 207, 0.28)";
      context.lineWidth = 1;
      context.stroke();
      const edgeFade = context.createRadialGradient(centerX, centerY, radius * 0.94, centerX, centerY, radius * 1.04);
      edgeFade.addColorStop(0, "rgba(255, 255, 255, 1)");
      edgeFade.addColorStop(0.55, "rgba(255, 255, 255, 0.82)");
      edgeFade.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.globalCompositeOperation = "destination-in";
      context.fillStyle = edgeFade;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      routes = routes.filter((route) => now - route.startedAt <= route.duration * 1.7);
      if (!reducedMotion) frameId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseRadius = Math.min(width, height) * 0.4;
      centerX = width / 2;
      centerY = height / 2;
      if (reducedMotion && isVisible) draw(performance.now());
    };

    const addEvent = () => {
      const list = eventsRef.current;
      if (!list.length) return;
      const now = performance.now();
      const route = createVisualRoute(list[eventIndex++ % list.length], now);
      if (route) routes = [...routes, route].slice(-MAX_ROUTES);
      if (reducedMotion && isVisible) draw(now);
    };

    const redraw = () => {
      if (reducedMotion && isVisible) draw(performance.now());
    };
    const zoomBy = (factor: number) => {
      zoom = Math.max(ZOOM_LIMITS[0], Math.min(ZOOM_LIMITS[1], zoom * factor));
      redraw();
    };
    const onPointerDown = (event: PointerEvent) => {
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragging = true;
    };
    const onPointerMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const current = { x: event.clientX, y: event.clientY };
      const other = [...pointers].find(([id]) => id !== event.pointerId)?.[1];
      if (other) {
        const before = Math.hypot(previous.x - other.x, previous.y - other.y);
        if (before) zoomBy(Math.hypot(current.x - other.x, current.y - other.y) / before);
      } else {
        rotationY += (current.x - previous.x) / radius;
        rotationX = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, rotationX + (current.y - previous.y) / radius));
        redraw();
      }
      pointers.set(event.pointerId, current);
    };
    const onPointerUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      dragging = pointers.size > 0;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomBy(Math.exp(-event.deltaY * WHEEL_ZOOM_STEP));
    };
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("wheel", onWheel, { passive: false });

    const onThemeChange = () => (colors = readTypeColors(stage));
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (reducedMotion) draw(performance.now());
        else if (!frameId) frameId = requestAnimationFrame(draw);
        if (eventTimer === undefined) {
          addEvent();
          eventTimer = window.setInterval(addEvent, SPAWN_MS);
        }
      } else {
        cancelAnimationFrame(frameId);
        frameId = 0;
        clearInterval(eventTimer);
        eventTimer = undefined;
      }
    });
    intersectionObserver.observe(stage);
    window.addEventListener("themechange", onThemeChange);
    resize();

    return () => {
      clearInterval(eventTimer);
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("themechange", onThemeChange);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className="threat-globe" ref={stageRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
