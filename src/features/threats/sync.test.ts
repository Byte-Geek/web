// Run: node --test src/features/threats/sync.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildLookup } from "./geoip.ts";
import { buildSnapshot, mergeCounts, type Radar } from "./sync.ts";

test("geo lookup finds IPv4 ranges and rejects junk", () => {
  const lookup = buildLookup("0.0.0.0,0.255.255.255,ZZ\n1.0.0.0,1.0.0.255,AU\n1.0.1.0,1.0.3.255,CN\n2001::,2001::ffff,US\n");
  assert.equal(lookup("1.0.0.7"), "AU");
  assert.equal(lookup("1.0.2.200"), "CN");
  assert.equal(lookup("0.1.2.3"), null);
  assert.equal(lookup("9.9.9.9"), null);
  assert.equal(lookup("example.com"), null);
  assert.equal(lookup("1.0.0.256"), null);
});

test("snapshot uses real counts, Radar trend and only known types", () => {
  const radar: Radar = {
    pairs: [
      { from: "US", to: "DE", value: 60 },
      { from: "CN", to: "US", value: 40 },
    ],
    origins: [{ country: "US", percent: 30 }],
    targets: [
      { country: "DE", percent: 50 },
      { country: "US", percent: 50 },
    ],
    series: [...Array(24).fill(1), ...Array(24).fill(1.5)],
  };
  const feeds = mergeCounts([{ botnet: { RU: 2 } }, { botnet: { RU: 1, NL: 1 }, malware: { US: 4 } }]);
  const snapshot = buildSnapshot(radar, feeds, Date.parse("2026-11-09T00:00:00Z"), () => 0.5);
  assert.equal(snapshot.total24h, 8);
  assert.equal(snapshot.deltaPercent, 50);
  assert.deepEqual(snapshot.split, { malware: 50, botnet: 50 });
  assert.equal(snapshot.trend.length, 24);
  assert.equal(snapshot.events.length, 45);
  for (const event of snapshot.events) assert.notEqual(event.from, event.to);
  assert.ok(snapshot.events.some((event) => event.type === "ddos"));
});
