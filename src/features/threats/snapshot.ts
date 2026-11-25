import "server-only";
import { getThreatSnapshot } from "@/cms/queries";
import type { AttackType } from "./attack-types";

export type CountryShare = { country: string; percent: number };
export type ThreatEvent = { type: AttackType; from: string; to: string };
export type Snapshot = {
  generatedAt: string;
  total24h: number;
  deltaPercent: number;
  split: Partial<Record<AttackType, number>>;
  sources: CountryShare[];
  targets: CountryShare[];
  trend: number[];
  events: ThreatEvent[];
};

const STALE_AFTER_MS = 30 * 60_000;

export async function getSnapshot(): Promise<Snapshot | null> {
  const stored = await getThreatSnapshot().catch(() => null);
  if (!stored?.data || !stored.generatedAt || Date.now() - new Date(stored.generatedAt).getTime() > STALE_AFTER_MS) return null;
  return { ...(stored.data as Snapshot), generatedAt: stored.generatedAt };
}
