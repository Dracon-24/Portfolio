# Kumar Manthan Portfolio

React and TypeScript portfolio hosted on GitHub Pages.

Live website: https://dracon-24.github.io/Portfolio/

## Development

Use Node.js 24. From `site`, run `npm ci`, then `npm run dev`.
For the local statistics backend, run `npm run db:migrate:local` and `npm run dev:api` in a second terminal.

## Deployment

1. Push changes to the `main` branch of this repository.
2. GitHub Actions runs tests, builds the portfolio, fetches coding statistics, and deploys GitHub Pages.
3. Watch the **Deploy portfolio** workflow under the repository's Actions tab.
4. A successful deployment updates https://dracon-24.github.io/Portfolio/.

Repository Settings → Pages → Source must be **GitHub Actions**. No API key or paid hosting is required.

The workflow also runs every six hours to update coding statistics using the configured public JSON providers. GitHub may delay scheduled runs. A failed provider keeps its last successful values and timestamp; initial supplied values are explicitly marked as fallback. Codolio remains a profile link because no supported public statistics API is configured. GitHub Pages serves these periodically refreshed snapshots; it does not run the separate Cloudflare/D1 backend included for the original Sites deployment.

Project detail pages have generated entry files so direct links and refreshes work. The Vite base path and router basename support the `/Portfolio/` URL.
