Deployment notes — server vs static export

Goal
- Allow production deployments that support server routes (so `/api/analytics` works), or produce a static export with a build-time analytics snapshot.

Modes
- Serverful (recommended for server routes):
  - Set `NEXT_STATIC_EXPORT` to `false` or leave unset.
  - Deploy to a host that supports Next server functions (Vercel, Netlify with Next plugin, Render, Fly, etc.).
  - Ensure env vars are set in the host's secrets for analytics backend access (see "Env vars").

- Static export (GitHub Pages or other static host):
  - Set `NEXT_STATIC_EXPORT=true` when building.
  - The build will generate a static fallback file `public/api-analytics.json` (via `npm run generate:analytics`) containing either real analytics (if GA env vars provided at build time) or sample data.
  - Static hosts cannot accept POSTs to `/api/analytics` (no server-side collection). Use a server endpoint or third-party collector for event collection.

Scripts
- Build for server deployment:

```powershell
# Serverful build (produces server-capable .next)
npm run build:server
```

- Build for static export (produces `out/` for `gh-pages`):

```powershell
# Static export (run in CI with NEXT_STATIC_EXPORT=true)
$env:NEXT_STATIC_EXPORT='true'; npm run build && npm run generate:analytics && next export
```

Required env vars for server analytics
- For Google UA reporting (Analytics Reporting API v4):
  - `GA_CLIENT_EMAIL` (service account email)
  - `GA_PRIVATE_KEY` (private key; keep secret)
  - `GA_VIEW_ID` (UA view id)

- For Google Analytics GA4 Data API fallback:
  - `GA_PROPERTY_ID` (numeric property id)
  - `GA_CLIENT_EMAIL`, `GA_PRIVATE_KEY` (same service account with access to property)

- For Plausible:
  - `PLAUSIBLE_API_KEY`
  - `PLAUSIBLE_SITE_ID`

- For Mongo collector (server POST collection + aggregation):
  - `ANALYTICS_BACKEND=mongo`
  - `MONGODB_URI`

Security notes
- Never store `GA_PRIVATE_KEY` or sensitive credentials in a public repo. Use your host's secret store (Vercel Environment Variables, GitHub Actions secrets, etc.).
- If you generate analytics at build time on CI, ensure the build logs and artifacts do not leak private keys.

How to enable server routes on Vercel
1. Deploy the repository to Vercel.
2. In Vercel dashboard, set environment variables under Project Settings > Environment Variables.
3. Ensure `NEXT_STATIC_EXPORT` is not set (or set to `false`) so API routes are enabled.

How to keep static export for GitHub Pages
1. In your CI job, set `NEXT_STATIC_EXPORT=true` before running `npm run build`.
2. Provide GA env vars only if you want the build-time analytics snapshot.
3. After `npm run build`, the `postbuild` script runs `generate:analytics` and writes `public/api-analytics.json` which will be included in the exported `out/` directory.

If you want, I can:
- Add a `build:server` script and set up a GitHub Actions workflow stub to build & deploy to Vercel/Render with secrets.
- Or, I can try to run a local `next start` production server here to test `/api/analytics` (requires the env vars to be present locally).

## GitHub Pages CI (workflow)

I added a workflow at `.github/workflows/deploy-gh-pages.yml` that:

- Triggers on push to `main` and `development`.
- Runs `npm ci`, builds SCSS, sets `NEXT_STATIC_EXPORT=true`, runs `npm run build`, `npm run generate:analytics`, and `npx next export`.
- Deploys the `out/` directory to GitHub Pages using `peaceiris/actions-gh-pages` with `${{ secrets.GITHUB_TOKEN }}`.

### Repository secrets and env vars for CI
Set these under GitHub → Settings → Secrets and variables → Actions. The workflow uses `GITHUB_TOKEN` to publish to Pages; analytics credentials should be provided as repository secrets so the build-time generator can fetch real data.

- `GA_CLIENT_EMAIL` — Google Service Account email (optional; required for UA/GA4 fetching at build time).
- `GA_PRIVATE_KEY` — Google Service Account private key (multi-line; keep secret).
- `GA_VIEW_ID` — UA view id (optional).
- `GA_PROPERTY_ID` — GA4 numeric property id (optional; used as GA4 fallback).
- `PLAUSIBLE_API_KEY` — Plausible API key (optional).
- `PLAUSIBLE_SITE_ID` — Plausible site id (optional).
- `MONGODB_URI` — MongoDB connection string (not used for static export; required for server-backed collector).

### Cache configuration
- `ANALYTICS_CACHE_TTL` — Cache time-to-live in seconds for analytics responses (default: 300).
- `ANALYTICS_CACHE_SWR` — `stale-while-revalidate` seconds for CDN caching (default: 60).

The app uses an in-memory cache on the server to reduce repeat calls to Google/Plausible/Mongo. When deployed serverfully, set `ANALYTICS_CACHE_TTL` to an appropriate value for your needs (e.g., 300 for 5 minutes). The static build path (GitHub Pages) uses a build-time snapshot instead.

Notes:
- The included workflow uses `${{ secrets.GITHUB_TOKEN }}` to deploy Pages. If your repository has branch protections that prevent this token from pushing, create a Personal Access Token (PAT) with `repo` scope, store it as `GH_PAGES_PERSONAL_TOKEN`, and replace `github_token` in the workflow with that secret.
- Providing `GA_PRIVATE_KEY` to CI will make the generator attempt to fetch real reports during build; be cautious about logs and artifact exposure.

### How to trigger
1. Push to `development` or `main`. The workflow will run and deploy the exported `out/` site to GitHub Pages.
2. Check the Actions tab for logs. After success, Pages will publish your site and `api-analytics.json` will be available under the published site path.

If you want, I can also add a separate Actions workflow to build & deploy a serverful Next app to Vercel or Render; tell me which provider and I'll scaffold it.

