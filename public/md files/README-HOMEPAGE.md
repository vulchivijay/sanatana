Place your hero image at `public/hero.jpg` (recommended size: 1600×900 or wider).

If you don't add `public/hero.jpg`, the site will fall back to `/next.svg`.

To preview locally:

1. Install dependencies (if you haven't):

   npm install

2. Run the dev server (Windows PowerShell):

   npm run dev

3. Open http://localhost:3000 in your browser.

Notes:
- The hero image is loaded client-side and will use a small HEAD request to detect whether `public/hero.jpg` exists; if it doesn't, the fallback will appear.
- If you want to change the filename, update `app/page.tsx` and the README accordingly.
