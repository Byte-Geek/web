import type { TaskConfig } from "payload";
import { loadLookup } from "../../features/threats/geoip.ts";
import {
  buildSnapshot,
  type Counts,
  type FeedCounts,
  fetchAbuseIpdb,
  fetchFeodo,
  fetchRadar,
  fetchThreatFox,
  fetchUrlhaus,
  mergeCounts,
} from "../../features/threats/sync.ts";

// AbuseIPDB free plan allows 5 blacklist calls a day.
const ABUSEIPDB_EVERY_MS = 6 * 3600_000;

type Cache = { abuseipdb?: { at: number; scan: Counts } };

export const syncThreats: TaskConfig<{ input: object; output: object }> = {
  slug: "sync-threats",
  retries: 1,
  schedule: [{ cron: "0 */15 * * * *", queue: "threats" }],
  handler: async ({ req }) => {
    const { RADAR_API_TOKEN, ABUSECH_AUTH_KEY, ABUSEIPDB_API_KEY } = process.env;
    if (!RADAR_API_TOKEN) {
      req.payload.logger.warn("sync-threats: RADAR_API_TOKEN missing, map stays on demo data");
      return { output: {} };
    }
    const now = Date.now();
    const previous = await req.payload.findGlobal({ slug: "threat-snapshot", depth: 0 });
    const cache = ((previous as { cache?: Cache }).cache ?? {}) as Cache;
    const lookup = await loadLookup();

    // A failed feed only drops its category; Radar is required for the arcs and rankings.
    const optional = async <T>(name: string, run: () => Promise<T>) =>
      run().catch((error: unknown) => {
        req.payload.logger.error(`sync-threats: ${name} failed: ${String(error)}`);
        return null;
      });

    let abuseipdb = cache.abuseipdb;
    if (ABUSEIPDB_API_KEY && (!abuseipdb || now - abuseipdb.at > ABUSEIPDB_EVERY_MS)) {
      const scan = await optional("AbuseIPDB", () => fetchAbuseIpdb(ABUSEIPDB_API_KEY, lookup, now));
      if (scan) abuseipdb = { at: now, scan };
    }

    const [radar, ...feeds] = await Promise.all([
      fetchRadar(RADAR_API_TOKEN),
      optional("Feodo", () => fetchFeodo(now)),
      ABUSECH_AUTH_KEY ? optional("ThreatFox", () => fetchThreatFox(ABUSECH_AUTH_KEY, lookup)) : null,
      ABUSECH_AUTH_KEY ? optional("URLhaus", () => fetchUrlhaus(ABUSECH_AUTH_KEY, lookup, now)) : null,
    ]);
    const counts = mergeCounts([...feeds.filter((feed): feed is FeedCounts => !!feed), abuseipdb ? { scan: abuseipdb.scan } : {}]);
    const snapshot = buildSnapshot(radar, counts, now);

    await req.payload.updateGlobal({
      slug: "threat-snapshot",
      data: { generatedAt: snapshot.generatedAt, data: snapshot, cache: { abuseipdb } },
      context: { disableRevalidate: true },
    });
    return { output: {} };
  },
};
