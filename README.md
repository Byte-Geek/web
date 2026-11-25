# INTELLECT · site

Next.js 16 (App Router) · Tailwind CSS 4 · Payload CMS 3 (SQLite / Turso) · next-intl (ro implicit, en, ru).

Demo: **https://web-gules-iota-85.vercel.app** · CMS: [/admin](https://web-gules-iota-85.vercel.app/admin)

## Pornire

```bash
npm install
cp .env.example .env   # completează PAYLOAD_SECRET cu un șir aleator lung
npm run seed
npm run dev
```

Site: `http://localhost:3000` · CMS: `/admin` (contul de administrator se creează la prima deschidere).

## Demo pe Vercel

- Baza de date e pe [Turso](https://turso.tech) (SQLite în cloud, Frankfurt), pentru că pe Vercel fișierele locale nu se păstrează.
- Variabile pe Vercel: `DATABASE_URI` (`libsql://…`), `DATABASE_AUTH_TOKEN`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL=https://web-gules-iota-85.vercel.app`, plus cheile Turnstile; restul din `.env.example` sunt opționale.
- Function Region: `fra1`, lângă bază.
- Conținutul se încarcă rulând `npm run seed` local cu `.env` legat la Turso.
- Fiecare push pe `main` face deploy automat.
- Limitări: imaginile urcate din CMS nu se păstrează (nu există stocare externă), formularul nu trimite email fără `RESEND_API_KEY`, iar harta afișează „date indisponibile”, pentru că job-ul `sync-threats` nu rulează pe Vercel.

## Comenzi

| Comandă | Ce face |
| --- | --- |
| `dev` · `build` · `start` | dezvoltare, build de producție, server de producție |
| `lint` · `format` · `typecheck` | Biome, TypeScript |
| `seed` | șterge și recreează conținutul ro/en/ru (nu atinge administratorii și mesajele) |
| `generate:types` · `generate:importmap` | după modificări în schema Payload |

## Structură

```text
src/
  app/(site)/[locale]/   paginile publice; rutele interne sunt în engleză, URL-urile traduse în i18n/routing.ts
  app/(payload)/         panoul și API-ul Payload (generate)
  app/api/threats/       snapshot agregat pentru hartă
  app/og/                imagini Open Graph semnate
  app/.well-known/       security.txt
  cms/                   configurația Payload: colecții, globale, câmpuri, acces, job-uri, seed, interogări
  components/layout/     header, footer, meniuri, comutatoare de temă și limbă
  components/ui/         elemente reutilizabile (iconițe, secțiuni, tab-uri, filtre, FAQ, CTA)
  components/cards/      carduri de conținut (serviciu, studiu de caz, articol, membru, tehnologie)
  components/kokonutui/  efecte vizuale (fundal animat, text glitch, pastilă glisantă, inerția caruselului)
  features/home/         secțiunile paginii principale
  features/threats/      globul (canvas, 3D și 2D), job-ul de date, snapshot, jurnal
  features/contact/      formular, Server Action, validare, protecții anti-spam
  features/legal/        paginile legale
  features/seo/          imaginile Open Graph: șablon, semnătură HMAC, fonturi Manrope
  i18n/                  rutare, navigare, încărcarea mesajelor
  lib/                   SEO, formatare, headere de securitate, taxonomii
  styles/                tokeni (tokens.css), Tailwind @theme (globals.css), componente (components.css)
messages/                textele interfeței în ro, en, ru
public/images/           imagini statice (hero, hartă, emblemă)
scripts/build-map.mjs    generează public/images/map.webp din OpenStreetMap (node scripts/build-map.mjs <lat> <lng>)
```

## Decizii

- Paginile sunt statice și se regenerează la orice salvare în CMS; harta și teaserul ei se reîmprospătează la 5 minute.
- Harta: job-ul `sync-threats` (Payload Jobs, la 15 minute) citește Cloudflare Radar, abuse.ch și AbuseIPDB și scrie globalul `threat-snapshot`. Cheile sunt în `.env` (`RADAR_API_TOKEN`, `ABUSECH_AUTH_KEY`, `ABUSEIPDB_API_KEY`). Fără un snapshot mai nou de 30 de minute, site-ul scrie că datele nu sunt disponibile. Job-ul are nevoie de un server care rulează continuu.
- API-ul REST Payload e închis pentru public; site-ul citește prin Local API și filtrează explicit `status = published`. GraphQL e oprit.
- Contact: honeypot → Zod → limită per IP → Turnstile → salvare în `contact-messages` → notificare Resend (opțională).
- Configurația Payload (`src/cms`) folosește importuri relative cu extensia `.ts`, pentru că CLI-ul rulează cu `--disable-transpile`.
- SEO: `NEXT_PUBLIC_SITE_URL` se setează înainte de `build` (intră în canonical, hreflang, sitemap, JSON-LD). Imaginile Open Graph se generează la `/og` doar cu semnătură HMAC (cheia e `PAYLOAD_SECRET`). Codurile de verificare Google/Bing/Yandex se pun în `.env`.
