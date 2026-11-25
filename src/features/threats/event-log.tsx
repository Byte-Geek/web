"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { AttackShape } from "./attack-shape";
import type { ThreatEvent } from "./snapshot";

const LOG_SIZE = 8;
const LOG_INTERVAL_MS = 1500;

type LogEntry = ThreatEvent & { id: number };


export function useReplayLog(events: ThreatEvent[], isPaused: boolean, onEntry?: (event: ThreatEvent) => void) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const notify = useRef(onEntry);
  notify.current = onEntry;
  useEffect(() => {
    if (!events.length) return setEntries([]);
    if (isPaused) {
      const shown = events.slice(0, LOG_SIZE);
      for (const event of shown) notify.current?.(event);
      return setEntries(shown.map((event, id) => ({ ...event, id })));
    }
    let cursor = 0;
    const timer = setInterval(() => {
      if (document.hidden) return;
      const entry = { ...events[cursor % events.length], id: cursor++ };
      notify.current?.(entry);
      setEntries((list) => [entry, ...list].slice(0, LOG_SIZE));
    }, LOG_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [events, isPaused]);
  return entries;
}

export function EventLog({ entries, label }: { entries: LogEntry[]; label: string }) {
  const t = useTranslations("Threat.short");
  return (
    <ol className="event-log" aria-label={label}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <AttackShape type={entry.type} />
          <span>
            {entry.from} → {entry.to}
          </span>
          <span>{t(entry.type)}</span>
        </li>
      ))}
    </ol>
  );
}
