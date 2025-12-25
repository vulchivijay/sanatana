# Deploying static export to GitHub Pages (docs/)

This project uses Next.js `output: "export"` to create a static `out/` folder. To host on GitHub Pages while keeping dynamic data hosted elsewhere, follow these steps.

1) Prepare a remote API

- Run your API on a server or serverless platform (Vercel, Render, Fly, Cloudflare Workers, etc.).
- The API should implement the endpoints described in `README-DB.md` or the original `app/api/items` routes.

2) Configure the static site to call the remote API

- Set the environment variable `NEXT_PUBLIC_API_BASE` to your API base URL, e.g. `https://api.example.com`.
- The client helper `lib/apiClient.ts` will build requests against that base.

3) Build and export locally

```powershell
npm ci
npm run predeploy
# `predeploy` runs `next build`. With `next.config.ts: output: 'export'` this creates `out/`.
```

4) Preview the static output locally

```powershell
npx serve out
# open http://localhost:3000
```

5) Deploy to GitHub Pages using the `docs/` folder (workflow does this automatically)

- The repository includes a GitHub Actions workflow that builds the site, copies `out/` to `docs/` and commits it to `main` branch. Enable Pages to serve `main` / `docs` in repo Settings → Pages.

Notes
- API routes under `app/api` were removed from the static export; originals are preserved in `app/_api_disabled` for reference. Keep your external API hosted separately.
- If you prefer `gh-pages` branch publishing instead, use `npm run deploy` (requires `gh-pages` installed) — the repo still contains the `deploy` script.
