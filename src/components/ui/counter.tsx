"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1100;
const YEAR_COUNT_FROM = 30;

type CounterProps = { value: number; suffix?: string; locale: string; isYear?: boolean; className?: string };

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

const formatCount = (current: number, { locale, isYear, suffix }: Required<Pick<CounterProps, "locale" | "isYear" | "suffix">>) =>
  (isYear ? String(Math.round(current)) : Math.round(current).toLocaleString(locale)) + suffix;

export function Counter({ value, suffix = "", locale, isYear = false, className }: CounterProps) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(() => formatCount(value, { locale, isYear, suffix }));

  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = isYear ? value - YEAR_COUNT_FROM : 0;
    const animate = () => {
      const startedAt = performance.now();
      const step = (now: number) => {
        // The first frame's timestamp can be a little before startedAt: clamp, or the count dips below zero.
        const progress = Math.min(1, Math.max(0, (now - startedAt) / DURATION_MS));
        setDisplay(formatCount(from + (value - from) * easeOutCubic(progress), { locale, isYear, suffix }));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animate();
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [value, isYear, locale, suffix]);

  return (
    <b ref={ref} className={className}>
      {display}
    </b>
  );
}
