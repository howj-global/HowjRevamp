# HOWJ Website — project context

This site was scaffolded in a prior session (Cowork). Read this before making changes so you don't redo decisions or re-ask questions already answered. See also `README.md` for setup/deploy commands and `functions/README.md` for the registration function.

## Stack decisions (already made, don't re-litigate without reason)

- **Vite + React**, not Next.js — Hostinger is standard shared hosting (static files only), so the site ships as a static SPA.
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`, theme lives entirely in `src/index.css` under `@theme`.
- **No GSAP** — brief was "simple fades/reveals," handled by `src/hooks/useReveal.js` (IntersectionObserver) + `.reveal` CSS class. Only reach for GSAP/ScrollTrigger if the design calls for parallax/pinning/scrubbed timelines.
- **Notion as CMS**, build-time fetch only — `scripts/fetch-notion-content.mjs` runs as `prebuild`, writes `src/content/site.json`. No client-side Notion calls (keeps the token server-side, no runtime dependency on Notion).
- **Registrations** (name/email/phone) → `src/components/RegisterForm.jsx` → `src/lib/submitRegistration.js` → a Cloudflare Worker at `functions/register.js` (deployed separately, NOT on Hostinger — shared hosting can't run server code) → writes to a Notion database. See `functions/README.md` for deploy steps.

## Design tokens — current state

`design/figma/tokens.json` is the source of truth, pasted in from Figma exports. It's been updated once already (moved from a flat palette to a full primitive scale: `brand-primary-100..900`, `brand-secondary-100..900`, `neutral-gray-100..900`, `accent-{red,magenta,maroon}-100..900`, plus a fontSizes scale from `3xs` to `10xl`).

`src/index.css` mirrors it in three layers:
1. **Primitives** — direct from tokens.json (`--color-brand-primary-500`, etc.)
2. **Semantic aliases** — `--color-surface-brand`, `--color-text-primary`, `--color-border-default`, etc. **These are NOT in tokens.json** — they were inferred by convention so utility classes like `bg-surface-brand` work. If the Figma file has an actual semantic variable collection (separate from the primitive scale), pull that and replace the inferred mapping.
3. **Flat back-compat** — `--color-brand-primary`, `--color-brand-secondary` (aliased to the `-500` shade of each scale) because early components were written against these flat names before the scale existed.

**Tailwind v4 namespace-shadowing gotcha (bit us once, will bite again):** the custom `--spacing-{none,xs,sm,md,lg,xl,2xl,3xl,4xl}` tokens shadow Tailwind's built-in scales for any utility that also resolves from the spacing namespace. Concretely: `max-w-md` resolves to 24px (not 28rem) and `leading-none` resolves to line-height 0 (text collapses/overlaps). Use arbitrary values instead: `max-w-[28rem]`, `leading-[1]`. Existing `max-w-{xl,2xl,3xl}` usages in pages were already converted to arbitrary rem values.

**Open question, unresolved:** `brand.secondary` changed from deep green (`#008236`) to yellow/gold (`#FEDF00`) between token file versions. Existing components (Navbar active link, Register button, Hero CTA area, form focus states) all use `bg-brand-secondary`/`text-brand-secondary` and are now rendering yellow. Not confirmed with the user whether that's intentional or whether those spots should move to a different token (e.g. `text-brand` at the darker `-900` shade for readability). Check before doing more styling work on top of it.

## Notion — Expression/destination template (schema built, fetch script NOT written yet)

The `/expression` template (`src/pages/Expression.jsx` + `src/components/expression/*`) currently renders from a **mock** at `src/content/expressionMock.js`. That mock's shape is the contract — the Notion schema below was built to fill it.

**Workspace:** moved off the personal `olalekan aleem's` workspace onto HOWJ's official Notion account (a genuinely separate workspace — new page/database IDs, not a rename). Both DBs live under a **HOWJ Master** page there. The integration used by the fetch script is named **`HowjMedia`** (created by Onyinye on the HOWJ side) — share both DBs with it via "..." → Connections on each database (or on the parent page, which cascades).

- **`HOWJ Global`** — one row per expression. Database `b0dbad17-61fc-8220-968f-012c4b5220cf`.
- **`HOWJ Ministers`** — guest ministers. Database `1e3bad17-61fc-820d-833c-8164b5b0aa54`. Two-way relation: `Expression` ⇄ `Guest Ministers`.

(The old personal-workspace IDs — `HOWJ Global` `38122766-9e5a-8070-9529-dc983312f28f` / `HOWJ Ministers` `08933c065e38462bbebb5dbbac06bc03` — still exist and are still reachable with the old token, but are no longer the source of truth; don't fetch from them.)

Field → mock mapping (properties carry Notion descriptions explaining each):

| Notion (HOWJ Global) | mock field | notes |
|---|---|---|
| Slug | `slug` | required, lowercase → `/expression/<slug>` |
| Published | — | only checked rows get built |
| **Description** (pre-existing) | `overview` | reuse this, don't add another |
| City / Venue / Event Date | `city` / `venue` / `date` | hero meta row |
| Sections (multi-select) | `tags` | hero timeline nav; options match section ids: Revival, Documentary, Minister, Charity, Gallery |
| Logo / Hero Image | `logo` / `heroImage` | |
| Theme / Bible Verse | `theme` / `verse` | |
| Souls Impacted + Feature Image 1 | `featureStats[0]` | labels are static in code, only values come from Notion |
| In Attendance + Feature Image 2 | `featureStats[1]` | |
| Miracles Documented / Charity Impacted / Souls Through Charity | `numbers[0..2]` | rendered with a `+` suffix appended in code |
| Documentary Image / Documentary URL | `documentary` | |
| Charity Title / Charity Overview / Charity Images | `charity` | |
| Partners Label / Partner Logos | `partners` | |
| Guest Ministers (relation) | `ministers` | from HOWJ Ministers (Name, Photo, Role, Order) |

**`Images`** (pre-existing field, predates the template) → `gallery.images` — the page-bottom "Gallery" carousel (`src/components/expression/Gallery.jsx`, formerly "Charity Highlight"/`charityHighlight`, renamed per user request) shows every photo Notion has for the expression, not a curated subset. `Charity Highlight Images` is no longer read by the fetch script.

Pre-existing `Country`, `Event Type`, `Year` were left untouched (they predate the template).

**Fetch pipeline (built):** `scripts/fetch-expressions.mjs` (wired into `prebuild`) queries both DBs, downloads Notion file URLs into `public/expressions/<slug>/` and rewrites paths (Notion URLs are signed + expire — never hot-link), and writes `src/content/expressions.json` (keyed by slug, committed like `site.json`/`gallery.json`). `Expression.jsx` reads it via `useParams().slug`, falling back to `expressionMock` when the slug is absent or Notion wasn't fetched. The script **no-ops without `NOTION_TOKEN`**, so builds always succeed. It skips rows without a real `Slug` (or slug `x`) and only builds `Published` rows.

**Homepage Guest Ministers — now Notion-driven (don't hand-edit):** the same script also regenerates `src/content/ministers.json` from **every** row in `HOWJ Ministers` (not just rows related to an expression), downloading each `Photo` into `public/ministers/<name-slug>.<ext>` — that folder is wiped and rebuilt each run. `MinistersSection.jsx` reads the manifest. It replaced a hand-maintained list that had drifted: only 12 of the 24 ministers, and 3 of those pointed at wrong extensions (`.png`/`.webp` for files that were actually `.jpg`) so they rendered as broken images. Rows missing a Name or Photo are skipped with a warning.

**Upcoming expression (homepage boarding pass + marquee), built:** same script also writes `src/content/upcoming.json` (committed, like `expressions.json`) — the soonest `Published` row with a future `Event Date`, or `null` if nothing's upcoming. Selection is fully automatic (no manual "pin" field) per user decision. `Hero.jsx` reads it and feeds `BoardingPassCard`/`MarqueeBanner`; when `null` (or a field is blank) it falls through to each component's hardcoded Jamaica defaults, so the homepage never breaks between revivals. Two **optional** `HOWJ Global` properties feed this and don't exist in the schema yet — add them when there's a real upcoming row to flag:
- **`Airport Code`** (text, 3 letters, e.g. `ACC`) — falls back to the first 3 letters of `City` if blank.
- **`Country Code`** (text, 2-letter ISO 3166-1 alpha-2, e.g. `GH`) — converted to a Unicode flag emoji at build time (`flagEmoji()` in the script). If blank, `Hero.jsx` shows a neutral 🌍 placeholder rather than defaulting to the Jamaica flag (which would be wrong for a non-Jamaica destination).

**To go live (user actions):** create a Notion internal integration, share **both** `HOWJ Global` and `HOWJ Ministers` with it, put its token in `.env` as `NOTION_TOKEN`, then `npm run build`. Data caveats seen on the Brazil row: Slug was `x` (must be real), Published unchecked, Partners Label empty, Documentary Image held a video URL not an image (script falls back to hero), Charity Highlight Images empty (that carousel hides). Script strips `*markdown*` and `<br>` from text fields.

## Content state — still placeholder

`src/content/site.json` has placeholder copy everywhere (`content/copy/` source folder is empty — real copy was never written). Don't treat any hero/about/destinations text as final.

`src/content/gallery.json` is generated from `public/gallery/` by `npm run gallery:sync`. **Re-run it after adding/removing/moving anything in `public/gallery/`** — it had gone stale once: 7 `ghana-charity-*.jpg` entries pointed at files that had been moved into a `Ghana/` subfolder, and because those 7 are consecutive, the homepage stats-background slideshow appeared to freeze for ~56s while it cycled through the dead frames. (`StatsSection.jsx` now also drops any slide that 404s at runtime, so a stale path degrades instead of stalling.) Note the sync only walks the top level of `public/gallery/` — images inside per-country subfolders are not picked up.

The stats-background slideshow sources charity photos from **both** `gallery.json` (category `charity`) and every expression's `charity.images` in `expressions.json`, deduped — 39 slides currently.

Also `assets/icons/Howj Logo.png` exists but isn't wired into the Navbar (which currently uses `assets/icons/svg/plane.svg` as the mark).

## Figma components — hero pulled in, rest pending

The hero section (Figma node `87-5189` in file `Nc7E7NNfdkLjRlxD8eZB4x`) is implemented: `src/components/Hero.jsx` composes `HeroBackground.jsx` (Montego Bay image from `src/assets/hero/`; any `.mp4`/`.webm` dropped into `src/assets/hero/videos/` is auto-discovered via `import.meta.glob` and plays as a looping background playlist in filename order, double-buffered for seamless crossfades — the image stays as the no-video fallback), `BoardingPassCard.jsx` (ticket card with live countdown to 12 Dec 2026), and `MarqueeBanner.jsx` (pure-CSS infinite scroll, keyframes in `index.css`, pauses on hover). `PlaneIcon.jsx` is the brand jet inlined so it tints via `currentColor`; the Jamaica flag and calendar icons are inline SVGs in `BoardingPassCard.jsx`. Fonts (Barlow / Barlow Semi Condensed / Barlow Condensed) are now loaded via Google Fonts in `index.html` — they were declared in the theme but never actually loaded before.

The Navbar (node `86-4096`) is implemented: `src/components/Navbar.jsx` is the floating three-segment mint bar (logo | links | Register CTA) on `brand-primary-300`, 130px tall on desktop, with a hamburger dropdown below `lg` per the design's dev note. It uses the real routes from `site.json` nav — the design's placeholder labels (Give, Partner, FAQ) point to pages that don't exist. Logo is `src/assets/brand/howj-logo-grey.svg` (copied from `assets/icons/Howjlogo-grey.svg`).

Still hand-built (not yet from Figma): Footer, everything else. Same workflow: node-specific URL → `get_design_context`.

## Deployment — GitHub Pages (stakeholder preview)

Live preview: **https://genesisaleem.github.io/HowjRevamp/** — served from the `gh-pages` branch (legacy Pages build, source pushed manually). The repo is `genesisAleem/HowjRevamp` (public). To redeploy after changes: `vite build --base=/HowjRevamp/`, copy `dist/index.html` to `dist/404.html` (SPA fallback), commit `dist/` to `gh-pages`, force-push. The stored GitHub PAT (osxkeychain) lacks the `workflow` scope, so **pushes containing `.github/workflows/` files are rejected** — that's why deploys are manual instead of via Actions. `BrowserRouter` gets `basename={import.meta.env.BASE_URL}` and gallery image srcs are prefixed with `BASE_URL` so the subpath works; keep new absolute `/...` asset references BASE_URL-aware. Hostinger remains the production target (root path, so BASE_URL degrades to `/`).

## Known non-issue from the prior environment

The prior session hit file-corruption issues (null-byte padding) when overwriting pre-existing files through its sandboxed file-mount tooling — worked around by writing files via shell heredoc instead. This was specific to that sandbox's fuse-mount setup and does not apply here; normal file writes are fine.

## Other loose ends

- `assets/icons/svg/WORLDMAP.svg` (3.7MB) is no longer imported — the hero rewrite dropped it, so it's out of the bundle. `src/assets/brand/worldmap.svg` is now an unused leftover.
- `src/assets/hero/montegobay.png` (2.4MB, copied from `assets/images/gallery/`) is the hero background and should be compressed/resized (or replaced by the background video) before launch. It's still NOT in `public/gallery/` for the gallery page.
- `code/` at the project root is a leftover empty placeholder folder from before the Vite scaffold existed — superseded by `src/`, safe to ignore/remove.
- `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `src/App.css` are unused leftovers from the initial `create-vite` template — harmless, not imported anywhere.
