# Coding statistics integration

## Architecture and changed files

The existing React + TypeScript + Vite UI is retained. The previous static deployment has been upgraded to a small Cloudflare-compatible Worker on the same Site. No Express server, new UI framework, private cookies, or paid API is required.

- `shared/coding-config.ts`: actual usernames, profile URLs, public provider origins, timing defaults. Codolio is a permanent profile with no configured API.
- `shared/coding-types.ts`: normalized optional statistics and per-platform freshness/source metadata.
- `shared/coding-fallbacks.ts`: the owner's initial snapshots. They have no successful-fetch timestamp and are never inserted as live cache values.
- `server/adapters.ts`: independent LeetCode, CodeChef, GFG, and unavailable Codolio adapters; JSON/identity/numeric validation; bounded responses and independent timeouts.
- `server/cache.ts`: durable D1 storage and atomic per-profile refresh leases.
- `server/service.ts`: initial fetch, stale-while-revalidate, last-known-good retention, and failure backoff.
- `server/worker.ts`: same-origin `GET /api/coding-stats` and static frontend serving.
- `db/schema.ts`, `drizzle.config.ts`, `drizzle/`: cache schema and generated, schema-only migrations.
- `src/context/CodingStatsContext.tsx`: one shared frontend request, an initial checking state, and at most one delayed follow-up when revalidation is active. No browser polling loop or provider scraping.
- `src/data/codingStatsView.ts`: validation and presentation of ratings, optional fields, statuses, and dynamic difficulty labels.
- `src/data/codingProfiles.ts`: permanent identities and links, independent of API availability.
- `src/components/CodingProfileCard.tsx`, `Hero.tsx`, `pages/Home.tsx`, `main.tsx`: connect existing UI to the same dataset; Codolio always renders. Existing copy outside statistics is preserved.
- `src/styles/global.css`: small additive rules for status text, loading stability, and unavailable values. Existing theme and layout remain intact.
- `vite.config.ts`, `scripts/build-worker.mjs`, `server/local-dev.ts`, `.openai/hosting.json`: frontend/Worker output, local proxy, local D1, Sites binding declarations.
- `tests/`: provider, real-SQLite cache/lease, and React rendering regression tests.

## Research and actual sources

There is no verified supported official API used by this implementation. All enabled adapters call documented third-party **JSON APIs** server-side; none scrape platform HTML, replay private sessions, or bypass anti-bot protections. Platform internals behind those third-party APIs are outside this application's control. Availability and authorization policies can change; there is no SLA.

| Platform | Source used | Automatically retrieved fields |
| --- | --- | --- |
| LeetCode | `https://leetcode-stats.tashif.codes/Dracon24` | Current contest rating, highest rating, total solved, easy/medium/hard solved, contest count, and rank label if supplied |
| CodeChef | `https://codechef-stats.tashif.codes/rishukm04` | Current rating, highest rating, provider's star label, total solved, contest count |
| GeeksforGeeks | `https://gfg-stats.tashif.codes/rishugjt0` | Total solved |
| Codolio | Actual external profile only | No public statistics API was verified; no aggregate counts are invented |

Primary provider documentation/source:

- https://github.com/tashifkhan/LeetCode-Stats-API
- https://github.com/tashifkhan/codechef-stats-api
- https://github.com/tashifkhan/GFG-Stats-API
- Live OpenAPI: append `/openapi.json` to the respective provider origin.
- LeetCode platform terms: https://leetcode.com/terms/ — direct crawling/scraping is prohibited. This application does not directly call or scrape LeetCode.
- Codolio official help: https://codolio.com/help-center — describes profile aggregation and owner-triggered synchronization, not a documented third-party statistics API.

Verified responses during implementation (9 October 2026) returned LeetCode 510 solved (150/310/50), current 1834.741 / highest 1865.513; CodeChef current 1400 / highest 1454, 80 solved, 22 contests, 2-star; GFG 140 solved. These are research observations, not hardcoded replacement statistics. The verified LeetCode provider rank is null, so the current badge is not inferred from the old Knight snapshot. Contest global ranking is not present in the chosen summary and is omitted. The initial LeetCode 1880/365 and CodeChef/GFG snapshots remain fallback-only.

An alternative Alfa LeetCode API was researched. Its profile/contest requests returned HTTP 429 during verification; it is not used as an automatic failover. No undocumented Codolio endpoints are probed or used.

## Cache and freshness

Default refresh interval: **six hours**, demand-driven. The first uncached API request attempts all enabled providers in parallel; each has an independent eight-second timeout. Subsequent loads read D1. Expired successful values return immediately while `ctx.waitUntil` revalidates them. No exact-time cron or recurring agent automation is claimed: if nobody loads the portfolio, there is no refresh until the next request.

D1 stores only normalized public metrics, successful fetch timestamps, attempts, next-attempt times, sanitized failure reasons, and a short lease. A cache key includes platform, username, provider origin, and adapter version, preventing old-account data from being shown after configuration changes. Atomic SQL leases suppress concurrent refreshes across serverless isolates. Success sets the next attempt six hours ahead. Failure retains the previous payload and successful timestamp, with a default 30-minute retry delay; provider `Retry-After` can extend it up to one day. An expired lease allows recovery after an interrupted Worker.

The chosen providers maintain their own caches; `fetchedAt` means this portfolio retrieved a successful provider response, not that the upstream platform recomputed every metric at that moment. Cards therefore say **Fetched … · Cached**, never promise realtime synchronization, and disclose stale/fallback states. Unknown fields are omitted or say Unavailable, rather than numeric zero. A genuine numeric zero is preserved.

The public read endpoint accepts no arbitrary usernames, provider URLs, forced-refresh query, or mutation. Upstream calls are globally limited by the D1 cooldown, including across visitors. There is deliberately no manual-refresh button that could bypass provider cooldowns. Failure of one platform does not invalidate the others. D1 unavailability returns a 503 structured fallback response rather than crashing the homepage.

## Provider limits and costs

No account, API key, or paid tier was required for the verified endpoints. This is not a guarantee of future pricing or availability. The providers' source defaults specify 60 requests/IP/minute and 30 requests/handle/minute, with shared backoff and optional Redis caches; actual hosted values are not published as a contractual quota. The portfolio normally makes one request/provider/six hours, and respects 429 cooldowns rather than switching domains or bypassing limits. Cloudflare/Sites runtime and D1 are hosting infrastructure, not a paid third-party statistics subscription.

## Configuration and secrets

No secret environment variables are required. Optional **server-only** Worker variables:

- `CODING_STATS_REFRESH_SECONDS` (default 21600; accepted range 3600–604800)
- `CODING_STATS_TIMEOUT_MS` (default 8000; accepted range 1000–15000)
- `CODING_STATS_RETRY_SECONDS` (default 1800; accepted range 300–86400)

Use shell environment variables for the local API and Sites environment settings for hosted values. `.env.example` documents placeholders; it contains no credentials. Do not prefix credentials with `VITE_`. Public profile/user settings belong in `shared/coding-config.ts`. D1 `DB` and static `ASSETS` are runtime bindings, not string environment variables. Sites owns the real hosted database ID. Local preview uses Node’s built-in SQLite through a small D1-shaped bridge, and runs the same Worker request handler. No hosted database ID is fabricated.

## Run, test, build, and deploy

```sh
npm ci --legacy-peer-deps
npm run db:migrate:local
npm run build
npm run dev:api
# In a second terminal:
npm run dev
# The Vite /api proxy calls the local Worker on port 8787.
```

```sh
npm test
npm run build
```

After schema edits, run `npm run db:generate`, inspect the generated SQL, and add migrations rather than rewriting applied migrations. Local migration and preview commands do not affect production D1. Local verification requires Node 22.13+ with built-in SQLite (Node 26 was used here). The native edge-runtime download was slow, so local API/browser QA runs the same handler under Node; deployment uses the actual Cloudflare Worker runtime.

Deploy through the existing Sites workflow: retain the current project ID, run the Sites source/packaging helper, then save/deploy the archive. `.openai/hosting.json` declares logical `d1: "DB"` and no static-only mode; Sites applies generated `drizzle/` migrations and uploads `dist/server/index.js` with `dist/client/` assets. Keep Worker deployment private as before. A generic static upload of `dist/client/` alone cannot run this integration; it would need the same Worker/edge function and durable D1 cache.
