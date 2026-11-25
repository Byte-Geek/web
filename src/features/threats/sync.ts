import { z } from "zod";
import { ATTACK_TYPES, type AttackType } from "./attack-types.ts";
import type { CountryLookup } from "./geoip.ts";
import type { CountryShare, Snapshot, ThreatEvent } from "./snapshot.ts";

export type Counts = Record<string, number>;
type FeedType = Exclude<AttackType, "ddos">;
export type FeedCounts = Partial<Record<FeedType, Counts>>;
type Pair = { from: string; to: string; value: number };
export type Radar = { pairs: Pair[]; origins: CountryShare[]; targets: CountryShare[]; series: number[] };

const DAY_MS = 24 * 3600_000;
const TOP_COUNT = 10;
const EVENTS_PER_TYPE = 15;
const RADAR_URL = "https://api.cloudflare.com/client/v4/radar/attacks/layer7";
const TIMEOUT_MS = 30_000;

const round1 = (value: number) => Math.round(value * 10) / 10;
const isRecent = (iso: string | null | undefined, now: number) => !!iso && now - new Date(iso).getTime() < DAY_MS;
const abuseDate = (value: string) => `${value.replace(" UTC", "").replace(" ", "T")}Z`;

async function getJson(url: string, init: RequestInit = {}) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${new URL(url).host} ${response.status}`);
  return response.json();
}

function addCount(counts: Counts, country: string | null | undefined) {
  if (country) counts[country] = (counts[country] ?? 0) + 1;
}

const radarTop = <T extends z.ZodRawShape>(shape: T) =>
  z.object({ result: z.object({ top_0: z.array(z.object({ ...shape, value: z.coerce.number() })) }) });

export async function fetchRadar(token: string): Promise<Radar> {
  const get = (query: string) => getJson(`${RADAR_URL}${query}`, { headers: { Authorization: `Bearer ${token}` } });
  const [pairs, origins, targets, series] = await Promise.all([
    get("/top/attacks?dateRange=1d&limit=50&normalization=PERCENTAGE"),
    get(`/top/locations/origin?dateRange=1d&limit=${TOP_COUNT}`),
    get(`/top/locations/target?dateRange=1d&limit=${TOP_COUNT}`),
    get("/timeseries?dateRange=2d&aggInterval=1h&normalization=MIN0_MAX"),
  ]);
  return {
    pairs: radarTop({ originCountryAlpha2: z.string(), targetCountryAlpha2: z.string() })
      .parse(pairs)
      .result.top_0.map((row) => ({ from: row.originCountryAlpha2, to: row.targetCountryAlpha2, value: row.value })),
    origins: radarTop({ originCountryAlpha2: z.string() })
      .parse(origins)
      .result.top_0.map((row) => ({ country: row.originCountryAlpha2, percent: round1(row.value) })),
    targets: radarTop({ targetCountryAlpha2: z.string() })
      .parse(targets)
      .result.top_0.map((row) => ({ country: row.targetCountryAlpha2, percent: round1(row.value) })),
    series: z.object({ result: z.object({ serie_0: z.object({ values: z.array(z.coerce.number()) }) }) }).parse(series).result.serie_0
      .values,
  };
}

const abuseList = <T extends z.ZodTypeAny>(item: T) => z.array(item).or(z.string().transform(() => [] as z.infer<T>[]));

export async function fetchThreatFox(authKey: string, lookup: CountryLookup): Promise<FeedCounts> {
  const body = await getJson("https://threatfox-api.abuse.ch/api/v1/", {
    method: "POST",
    headers: { "Auth-Key": authKey, "Content-Type": "application/json" },
    body: JSON.stringify({ query: "get_iocs", days: 1 }),
  });
  const { data } = z.object({ data: abuseList(z.object({ ioc: z.string(), ioc_type: z.string(), threat_type: z.string() })) }).parse(body);
  const botnet: Counts = {};
  const malware: Counts = {};
  for (const row of data) {
    if (row.ioc_type !== "ip:port") continue;
    const country = lookup(row.ioc.split(":")[0]);
    if (row.threat_type === "botnet_cc") addCount(botnet, country);
    else if (row.threat_type === "payload_delivery") addCount(malware, country);
  }
  return { botnet, malware };
}

export async function fetchUrlhaus(authKey: string, lookup: CountryLookup, now: number): Promise<FeedCounts> {
  const body = await getJson("https://urlhaus-api.abuse.ch/v1/urls/recent/", { headers: { "Auth-Key": authKey } });
  const { urls } = z.object({ urls: abuseList(z.object({ host: z.string(), date_added: z.string() })) }).parse(body);
  const malware: Counts = {};
  for (const row of urls) if (isRecent(abuseDate(row.date_added), now)) addCount(malware, lookup(row.host));
  return { malware };
}

export async function fetchFeodo(now: number): Promise<FeedCounts> {
  const body = await getJson("https://feodotracker.abuse.ch/downloads/ipblocklist.json");
  const rows = z.array(z.object({ country: z.string().nullable(), last_online: z.string().nullable() })).parse(body);
  const botnet: Counts = {};
 for (const row of rows) if (row.last_online && isRecent(`${row.last_online}T23:59:59Z`, now)) addCount(botnet, row.country);
  return { botnet };
}

export async function fetchAbuseIpdb(apiKey: string, lookup: CountryLookup, now: number): Promise<Counts> {
  const body = await getJson("https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=100&limit=10000", {
    headers: { Key: apiKey, Accept: "application/json" },
  });
  const { data } = z
    .object({
      data: z.array(z.object({ ipAddress: z.string(), countryCode: z.string().nullish(), lastReportedAt: z.string().nullish() })),
    })
    .parse(body);
  const scan: Counts = {};
  for (const row of data) if (isRecent(row.lastReportedAt, now)) addCount(scan, row.countryCode ?? lookup(row.ipAddress));
  return scan;
}

export function mergeCounts(parts: FeedCounts[]): FeedCounts {
  const merged: FeedCounts = {};
  for (const part of parts) {
    for (const [type, counts] of Object.entries(part) as [FeedType, Counts][]) {
      merged[type] ??= {};
      const target = merged[type];
      for (const [country, count] of Object.entries(counts)) target[country] = (target[country] ?? 0) + count;
    }
  }
  return merged;
}

function weightedPick<T>(items: T[], weight: (item: T) => number, random: () => number): T | undefined {
  const total = items.reduce((sum, item) => sum + weight(item), 0);
  let roll = random() * total;
  for (const item of items) {
    roll -= weight(item);
    if (roll < 0) return item;
  }
  return items.at(-1);
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

function percentSplit(feeds: FeedCounts): Snapshot["split"] {
  const totals = ATTACK_TYPES.flatMap((type) => {
    const counts = feeds[type as FeedType];
    return counts ? [[type, sum(Object.values(counts))] as const] : [];
  }).filter(([, total]) => total > 0);
  const grand = sum(totals.map(([, total]) => total));
  return Object.fromEntries(totals.map(([type, total]) => [type, Math.round((total / grand) * 100)]));
}

function buildEvents(radar: Radar, feeds: FeedCounts, random: () => number): ThreatEvent[] {
  const pickers: [AttackType, () => { from: string; to: string } | undefined][] = [];
  if (radar.pairs.length) pickers.push(["ddos", () => weightedPick(radar.pairs, (pair) => pair.value, random)]);
  for (const type of ATTACK_TYPES) {
    const entries = Object.entries(feeds[type as FeedType] ?? {});
    if (type === "ddos" || !entries.length) continue;
    pickers.push([
      type,
      () => {
        const from = weightedPick(entries, ([, count]) => count, random)?.[0];
        const to = weightedPick(
          radar.targets.filter((target) => target.country !== from),
          (target) => target.percent,
          random,
        )?.country;
        return from && to ? { from, to } : undefined;
      },
    ]);
  }
  const events: ThreatEvent[] = [];
  for (let round = 0; round < EVENTS_PER_TYPE; round++) {
    for (const [type, pick] of pickers) {
      const route = pick();
      if (route) events.push({ ...route, type });
    }
  }
  return events;
}

export function buildSnapshot(radar: Radar, feeds: FeedCounts, now = Date.now(), random = Math.random): Snapshot {
  const last = radar.series.slice(-24);
  const previous = radar.series.slice(-48, -24);
  const previousTotal = sum(previous);
  return {
    generatedAt: new Date(now).toISOString(),
    total24h: sum(Object.values(feeds).flatMap((counts) => Object.values(counts ?? {}))),
    deltaPercent: previousTotal ? round1((sum(last) / previousTotal - 1) * 100) : 0,
    split: percentSplit(feeds),
    sources: radar.origins,
    targets: radar.targets,
    trend: last,
    events: buildEvents(radar, feeds, random),
  };
}
