# GitHub Pages Deployment Configuration

## Current Setup
- **Repository**: sanatanadharmam.in (project repository)
- **GitHub Pages Source**: `docs/` folder on `main` branch
- **Static Export**: Next.js v16 with `output: "export"`
- **Styles**: Tailwind CSS v4 (included in `_next/static/`)
- **Images**: Unoptimized SVG/PNG files copied to `docs/`

## Deployment Steps

### 1. Repository Settings
Go to **Settings → Pages**:
- **Source**: Deploy from a branch
- **Branch**: `main`
- **Folder**: `/docs`
- Click **Save**

### 2. GitHub Actions Workflow
The `.github/workflows/deploy-gh-pages.yml` workflow:
- Triggers on pushes to `main`, `master`, or `development`
- Runs `npm run build` to generate static export in `out/`
- Copies `out/*` → `docs/`
- Commits and pushes changes to `main` branch

### 3. Build & Deploy Locally
```bash
npm run build          # Generates ./out/
npm run deploy         # Commits to gh-pages branch (alternative)
```

Or push to trigger GitHub Actions:
```bash
git push origin development
```

## CSS & Images Not Loading?

### Root Causes:
1. **Trailing slashes mismatch**: Fixed with `trailingSlash: true`
2. **basePath not set**: If repo is hosted at subdirectory (not user pages)
3. **.nojekyll missing**: GitHub Pages may try to process `_next/` folder
4. **CSS files not copied**: Ensure `_next/static/` folder is in `docs/`

### Solution Checklist:
- ✅ `.nojekyll` file added to `docs/` folder
- ✅ Tailwind config with proper content paths
- ✅ Images using Next.js `<Image>` component with `unoptimized: true`
- ✅ Static export includes all asset files

## Verify Deployment
After pushing/deploying:
1. Go to `https://vulchivijay.github.io/sanatanadharmam.in` (or your repo URL)
2. Check Network tab in browser DevTools for CSS file loading
3. Verify images load from `/sanatanadharmam.in/_next/...`

## Notes
- All routes end with `/` due to `trailingSlash: true`
- SVG and image assets are in `public/` and copied to `docs/`
- CSS is bundled into `_next/static/` by Tailwind
- Dynamic API routes (ƒ) require external API backend
