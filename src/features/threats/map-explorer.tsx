"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { AttackShape } from "./attack-shape";
import { ALL_TYPES, ATTACK_TYPES, type AttackType, type TypeFilter } from "./attack-types";
import { EventLog, useReplayLog } from "./event-log";
import type { ThreatEvent } from "./snapshot";
import { ThreatGlobe } from "./threat-globe";
import { ThreatMapVisual } from "./threat-map-visual";
import { useReducedMotion } from "./use-reduced-motion";

const REFRESH_MS = 5 * 60_000;

type ViewMode = "3d" | "2d";

const prefersFlatView = () => innerWidth < 768;

function useLiveEvents(initial: ThreatEvent[]) {
  const [events, setEvents] = useState(initial);
  useEffect(() => {
    const timer = setInterval(async () => {
      if (document.hidden) return;
      const response = await fetch("/api/threats").catch(() => null);
      const snapshot = response?.ok ? ((await response.json()) as { events: ThreatEvent[] } | null) : null;
      if (snapshot) setEvents(snapshot.events);
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, []);
  return events;
}

export function MapExplorer({ initialEvents }: { initialEvents: ThreatEvent[] }) {
  const t = useTranslations("Map");
  const threat = useTranslations("Threat");
  const isPaused = useReducedMotion();
  const [mode, setMode] = useState<ViewMode>("3d");
  const [filter, setFilter] = useState<TypeFilter>(ALL_TYPES);

  const allEvents = useLiveEvents(initialEvents);
  const shownEvents = useMemo(() => allEvents.filter((event) => filter[event.type]), [allEvents, filter]);
  const entries = useReplayLog(shownEvents, isPaused);

  useEffect(() => {
    if (prefersFlatView()) setMode("2d");
  }, []);

  const toggleType = (type: AttackType) => setFilter((current) => ({ ...current, [type]: !current[type] }));

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="map-stage" role="region" aria-label={t("stageLabel")}>
        {mode === "3d" ? <ThreatGlobe events={shownEvents} /> : <ThreatMapVisual events={shownEvents} />}
        <div className="absolute inset-x-4 top-4 flex flex-wrap items-center gap-2">
          <fieldset className="contents">
            <legend className="sr-only">{t("filters")}</legend>
            {ATTACK_TYPES.map((type) => (
              <button key={type} type="button" className="chip" aria-pressed={filter[type]} onClick={() => toggleType(type)}>
                <AttackShape type={type} />
                {threat(type)}
              </button>
            ))}
          </fieldset>
          <div className="segmented lg:ml-auto" role="group" aria-label={t("view")}>
            {(["3d", "2d"] as const).map((option) => (
              <button key={option} type="button" aria-pressed={mode === option} onClick={() => setMode(option)}>
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <section aria-labelledby="map-log-title" className="border-t border-border lg:border-t-0 lg:border-l">
        <h2 id="map-log-title" className="label px-4 pt-4">
          {t("log")}
        </h2>
        <EventLog entries={entries} label={t("log")} />
      </section>
    </div>
  );
}
