// Builds public/images/map.webp: real OpenStreetMap streets around the office, recoloured navy + cyan.
// Usage: node scripts/build-map.mjs <lat> <lng>   (rerun when the address changes)
import sharp from "sharp";

const [lat, lng] = process.argv.slice(2).map(Number);
if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error("Usage: node scripts/build-map.mjs <lat> <lng>");

const ZOOM = 16;
const TILE = 256;
const WIDTH = 1250;
const HEIGHT = 800;
// The office sits in the upper part of the view so the main roads south of it show, like on openstreetmap.org.
const OFFICE_Y = 200;
const NAVY = [5, 13, 24];
const CYAN = [25, 211, 243];

const scale = TILE * 2 ** ZOOM;
const cx = ((lng + 180) / 360) * scale;
const sin = Math.sin((lat * Math.PI) / 180);
const cy = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
const left = Math.round(cx - WIDTH / 2);
const top = Math.round(cy - OFFICE_Y);
const [tx0, ty0] = [Math.floor(left / TILE), Math.floor(top / TILE)];
const [tx1, ty1] = [Math.floor((left + WIDTH) / TILE), Math.floor((top + HEIGHT) / TILE)];

const tiles = [];
for (let x = tx0; x <= tx1; x++) {
  for (let y = ty0; y <= ty1; y++) {
    // OSM tile policy: identify the app, fetch only the handful of tiles needed once.
    const response = await fetch(`https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`, {
      headers: { "User-Agent": "intellect-site-map-builder/1.0" },
    });
    if (!response.ok) throw new Error(`Tile ${x}/${y}: HTTP ${response.status}`);
    tiles.push({ input: Buffer.from(await response.arrayBuffer()), left: (x - tx0) * TILE, top: (y - ty0) * TILE });
  }
}

// sharp crops before compositing within one pipeline, so stitch first and crop in a second pass.
const mosaic = await sharp({
  create: { width: (tx1 - tx0 + 1) * TILE, height: (ty1 - ty0 + 1) * TILE, channels: 3, background: "#fff" },
})
  .composite(tiles)
  .png()
  .toBuffer();
const { data } = await sharp(mosaic)
  .extract({ left: left - tx0 * TILE, top: top - ty0 * TILE, width: WIDTH, height: HEIGHT })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// OSM draws streets white and main roads yellow/orange: keep those as cyan lines on navy, drop fills and buildings.
const out = Buffer.alloc(WIDTH * HEIGHT * 3);
for (let p = 0; p < WIDTH * HEIGHT; p++) {
  const [r, g, b] = [data[p * 3], data[p * 3 + 1], data[p * 3 + 2]];
  const white = Math.min(1, Math.max(0, ((r + g + b) / 765 - 0.92) / 0.08));
  const major = r > 200 && g > 150 && r - b > 60 ? 1 : 0;
  const road = Math.max(white * 0.7, major * 0.9);
  for (let c = 0; c < 3; c++) out[p * 3 + c] = Math.round(NAVY[c] + (CYAN[c] - NAVY[c]) * road);
}

const pin = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 64 64">
  <circle cx="32" cy="52" r="12" fill="rgb(25 211 243 / 0.25)"/>
  <path d="M32 6a16 16 0 0 0-16 16c0 12 16 30 16 30s16-18 16-30A16 16 0 0 0 32 6Z" fill="rgb(25 211 243)"/>
  <circle cx="32" cy="22" r="6" fill="rgb(5 13 24)"/>
</svg>`);

await sharp(out, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
  .composite([{ input: pin, left: WIDTH / 2 - 48, top: OFFICE_Y - 78 }])
  .webp({ quality: 80 })
  .toFile("public/images/map.webp");
console.log(`public/images/map.webp written for ${lat}, ${lng}`);
