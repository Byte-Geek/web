"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/routing";

type Slugs = Partial<Record<Locale, string>>;

let current: Slugs | null = null;
const listeners = new Set<() => void>();

function publish(value: Slugs | null) {
  current = value;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const useLocalizedSlugs = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

export function LocalizedSlugs({ slugs }: { slugs: Slugs }) {
  useEffect(() => {
    publish(slugs);
    return () => publish(null);
  }, [slugs]);
  return null;
}
