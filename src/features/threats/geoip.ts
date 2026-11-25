import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";

const DATA_DIR = path.resolve(process.cwd(), "data");

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part) || Number(part) > 255) return null;
    value = value * 256 + Number(part);
  }
  return value;
}

export type CountryLookup = (ip: string) => string | null;

export function buildLookup(csv: string): CountryLookup {
  const starts: number[] = [];
  const ends: number[] = [];
  const countries: string[] = [];
  for (const line of csv.split("\n")) {
    const [start, end, country] = line.trim().split(",");
    const from = ipv4ToInt(start ?? "");
    const to = ipv4ToInt(end ?? "");
    if (from === null || to === null || !country || country === "ZZ") continue;
    starts.push(from);
    ends.push(to);
    countries.push(country);
  }
  return (ip) => {
    const value = ipv4ToInt(ip);
    if (value === null) return null;
    let low = 0;
    let high = starts.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (starts[mid] > value) high = mid - 1;
      else if (ends[mid] < value) low = mid + 1;
      else return countries[mid];
    }
    return null;
  };
}

export async function loadLookup(now = new Date()): Promise<CountryLookup> {
  const month = now.toISOString().slice(0, 7);
  const file = path.join(DATA_DIR, `dbip-country-lite-${month}.csv.gz`);
  if (!existsSync(file)) {
    const response = await fetch(`https://download.db-ip.com/free/dbip-country-lite-${month}.csv.gz`);
    if (!response.ok) throw new Error(`DB-IP download failed: ${response.status}`);
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(file, Buffer.from(await response.arrayBuffer()));
  }
  return buildLookup(gunzipSync(await readFile(file)).toString("utf8"));
}
