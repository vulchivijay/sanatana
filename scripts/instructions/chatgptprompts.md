You are working on a Next.js App Router project configured with `output: 'export'` (fully static site).

Problem:
The current SEO, metadata, and sitemap implementation is inconsistent, partially broken, or not scalable. Some pages are not indexed properly, and dynamic routes are not fully included in sitemap or metadata.

Goal:
Refactor and standardize the entire SEO system so that:

* All pages are indexable
* Sitemap is complete and accurate
* Metadata is consistent and dynamic
* Works fully with static export (no server dependencies)

Tasks:

---

1. CENTRALIZE SEO CONFIG

---

Create a reusable SEO utility:

* `/lib/seo.ts`
* Function: `generateSEO({ title, description, path, image, keywords })`

This function should:

* Return metadata object compatible with Next.js `generateMetadata()`
* Include:

  * title (with site suffix)
  * description
  * canonical URL (absolute)
  * openGraph
  * twitter metadata
  * robots (index, follow)

Base URL must come from:

* `process.env.NEXT_PUBLIC_SITE_URL`

---

2. RESTRUCTURE METADATA USAGE

---

* Remove duplicate or hardcoded metadata across pages
* Ensure ALL pages use `generateMetadata()` with centralized SEO utility
* Dynamic routes ([slug], [id]) must generate metadata dynamically based on content

---

3. FIX DYNAMIC ROUTES FOR STATIC EXPORT

---

* Implement `generateStaticParams()` for ALL dynamic routes
* Ensure:

  * Only valid slugs/ids are returned
  * Missing locale/content entries are filtered out
* Prevent build failures due to missing data

---

4. REBUILD SITEMAP SYSTEM

---

Create `/app/sitemap.ts`:

* Include ALL routes:

  * static pages
  * dynamic pages ([slug], [id])
* Pull data from same source as `generateStaticParams()`
* Each entry must include:

  * url (absolute)
  * lastModified
* Avoid duplicates
* Ensure sitemap works with static export

---

5. CREATE ROBOTS.TXT

---

Create `/app/robots.ts`:

* Allow all public pages
* Disallow:

  * /api
  * /admin (if exists)
* Include sitemap URL

---

6. ADD STRUCTURED DATA (JSON-LD)

---

* Add reusable schema generator:
  `/lib/schema.ts`
* Support:

  * WebPage
  * Article (for content pages)
  * BreadcrumbList
* Inject into pages via <script type="application/ld+json">

---

7. HANDLE MISSING DATA SAFELY

---

* If content not found:

  * Use `notFound()`
* If partial data missing:

  * Render fallback content
* Do NOT crash build

---

8. ENSURE STATIC EXPORT COMPATIBILITY

---

* Do NOT use server-only APIs
* Do NOT rely on runtime fetching for SEO-critical data
* All SEO data must be available at build time

---

9. IMPROVE INTERNAL LINKING

---

* Ensure all pages are reachable via <Link>
* No orphan pages
* Add breadcrumb navigation where possible

---

10. PERFORMANCE + INDEXING OPTIMIZATION

---

* Keep metadata lightweight
* Avoid large inline JSON in pages
* Ensure HTML contains real content (not client-only rendering)

---

11. OUTPUT EXPECTATION

---

Provide:

* `/lib/seo.ts`
* `/lib/schema.ts`
* `/app/sitemap.ts`
* `/app/robots.ts`
* Example refactored dynamic page ([id]/page.tsx)
* Example `generateStaticParams()`

Code must be:

* TypeScript-safe
* Production-ready
* Clean and reusable

---

## IMPORTANT:

* This is a STATIC EXPORT project (`output: 'export'`)
* All pages must be pre-rendered
* SEO must not depend on runtime APIs
* Ensure compatibility with large datasets (1000+ pages)

Focus on scalability, correctness, and Google indexing effectiveness.






You are working on a Next.js (App Router) TypeScript project.

Problem:
The codebase contains unused imports, unused variables, dead functions, redundant exports, and possibly unused script files. This increases build time, bundle size, and complexity.

Goal:
Clean and optimize the codebase by safely removing all unnecessary code while preserving functionality.

Tasks:

---

1. REMOVE UNUSED IMPORTS

---

* Identify and remove all unused imports from:

  * React components
  * utility files
  * API routes
* Do NOT remove imports that are used indirectly (e.g., types, dynamic usage)

---

2. REMOVE UNUSED VARIABLES & FUNCTIONS

---

* Delete variables, constants, and functions that are never used
* Remove commented-out code blocks
* Ensure no references remain

---

3. REMOVE UNUSED EXPORTS

---

* Identify exports that are not imported anywhere in the project
* Remove:

  * unused named exports
  * unused default exports
* Ensure no runtime or dynamic usage is broken

---

4. DELETE UNUSED FILES

---

* Identify files that are not imported or referenced anywhere:

  * components
  * utils
  * scripts
  * pages/routes
* Safely delete them
* Be careful with:

  * dynamic routes
  * file-based routing in Next.js
  * config files

---

5. CLEAN UNUSED SCRIPTS

---

* Review package.json scripts
* Remove scripts that are not used or redundant
* Ensure essential scripts remain:

  * dev
  * build
  * start
  * lint (optional)

---

6. OPTIMIZE IMPORTS

---

* Replace wildcard imports with specific imports where possible
* Remove duplicate imports
* Ensure consistent import paths

---

7. TYPESCRIPT SAFETY

---

* Ensure project compiles without errors after cleanup
* Avoid removing types that are required
* Maintain strict typing

---

8. NEXT.JS SAFETY CHECKS

---

* Do NOT remove:

  * layout.tsx
  * page.tsx
  * generateStaticParams
  * metadata functions
* Ensure routing structure is preserved

---

9. PERFORMANCE IMPROVEMENT

---

* Reduce bundle size
* Improve build time
* Avoid unnecessary dependencies

---

10. OUTPUT EXPECTATION

---

* Provide cleaned versions of affected files
* List deleted files
* List removed imports/exports
* Ensure no functionality is broken

---

## IMPORTANT:

* Do NOT break dynamic routing
* Do NOT remove SEO-related code
* Do NOT remove anything used via reflection or dynamic import
* Prefer safe removal over aggressive deletion

Focus on clean, minimal, production-ready code.


You are working on a Next.js (App Router) TypeScript project using Tailwind CSS.

Problem:
The UI lacks consistency across pages, subpages, and child routes. Header and footer are basic or inconsistent. Typography, spacing, padding, and margins are not standardized.

Goal:
Create a COMPLETE, consistent, and premium design system with:

* Unique header and footer design
* Mobile-first responsive layout
* Consistent typography, spacing, padding, and margins
* Reusable UI components and templates
* Light theme only (NO dark mode)

The design should feel modern, elegant, and production-grade.

---

1. GLOBAL DESIGN RULES (MANDATORY)

---

Apply across ALL pages and components:

* Mobile-first approach:
  Start with base styles → enhance with `sm: md: lg:`

* Container:
  `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

* Section spacing:
  `py-8 sm:py-10 md:py-12`

* Vertical rhythm:
  `space-y-6 md:space-y-8`

* Grid gaps:
  `gap-4 sm:gap-6`

* Border radius:
  `rounded-xl` (default), `rounded-2xl` (cards)

* Shadows:
  `shadow-sm` or subtle custom shadow only

---

2. TYPOGRAPHY SYSTEM (STRICT)

---

Standardize everywhere:

* Page Title:
  `text-2xl sm:text-3xl/12 md:text-4xl/16 font-semibold tracking-tight text-gray-900`

* Section Title:
  `text-lg sm:text-xl md:text-2xl font-semibold text-gray-900`

* Subtitle:
  `text-md sm:text-base text-gray-600`

* Body:
  `text-gray-700 leading-relaxed`

* Small / meta:
  `text-md sm:text-base text-gray-500`

DO NOT use arbitrary font sizes.

---

3. UNIQUE HEADER DESIGN

---

Create a modern sticky header:

* Layout:
  `sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100`

* Inner container:
  flex justify-between items-center

* Logo:
  Bold text or icon + text combination

* Navigation:
  Horizontal menu on desktop
  Mobile menu (hamburger) on small screens

* Nav links:
  `text-gray-600 hover:text-primary-600 transition`

* CTA button:
  Primary styled button

* Mobile menu:
  Collapsible panel with proper spacing

---

4. UNIQUE FOOTER DESIGN

---

Create a structured footer:

* Background:
  `bg-gray-50 border-t border-gray-100`

* Layout:
  Grid:
  `grid gap-6 sm:grid-cols-2 md:grid-cols-4`

* Sections:

  * About
  * Navigation links
  * Resources
  * Social links

* Text:
  `text-md sm:text-base text-gray-600`

* Bottom bar:
  copyright + links

* Spacing:
  `py-10 md:py-12`

---

5. REUSABLE COMPONENT SYSTEM

---

Create:

Card:

* `bg-white border border-gray-100 rounded-2xl shadow-sm p-5`

Button:

* Primary:
  `bg-primary-600 text-white hover:bg-primary-700 rounded-xl px-4 py-2`
* Secondary:
  `bg-gray-100 hover:bg-gray-200 text-gray-700`

Section wrapper:

* `py-10 md:py-14`

Container wrapper:

* reusable layout component

---

6. PAGE TEMPLATE STRUCTURE

---

A. Listing Page:

* Title + description
* Grid:
  `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
* Cards

B. Detail Page:

* Title
* Metadata row
* Content section
* Related items

C. Landing Section:

* Hero
* CTA
* Clean spacing

---

7. SPACING & CONSISTENCY ENFORCEMENT

---

* Replace ALL inconsistent spacing with standard scale
* Remove arbitrary padding/margin values
* Ensure alignment consistency across:

  * pages
  * subpages
  * child routes

---

8. MOBILE-FIRST RESPONSIVENESS

---

* Base styles = mobile
* Enhance progressively:
  sm → md → lg
* Ensure:

  * no overflow issues
  * proper stacking on mobile
  * readable typography

---

9. INTERACTION & POLISH

---

* Add subtle transitions:
  `transition-all duration-200`
* Hover states:
  `hover:shadow-md hover:-translate-y-0.5`
* Avoid excessive animation

---

10. REMOVE INCONSISTENCIES

---

* Remove inline styles
* Remove dark mode classes
* Normalize colors to palette
* Standardize layout across app

---

11. OUTPUT EXPECTATION

---

Provide:

* Header component
* Footer component
* Layout wrapper (used globally)
* Updated Tailwind classes across pages
* Example page.tsx (listing + detail)
* Clean reusable components

---

## IMPORTANT

* Do NOT change business logic
* Do NOT break routing
* Focus only on UI consistency and design quality
* Ensure design looks premium and cohesive

Goal:
Transform the entire app into a consistent, mobile-first, beautifully designed system with a strong visual identity.


You are working on a Next.js (App Router) TypeScript project.

Problem:
The codebase contains unused variables, functions, files, imports, and possibly unused npm dependencies. This increases build time, bundle size, and maintenance overhead.

Goal:
Perform a SAFE cleanup of dead code and unused dependencies without breaking routing, build, or runtime behavior.

STRICT WORKFLOW:

1. BASELINE & SAFETY

* First ensure the project builds successfully:

  * Run: `npx tsc --noEmit`
  * Run: `npm run build`
* Do NOT remove anything until current state is verified.

2. REMOVE UNUSED IMPORTS

* Identify and remove unused imports across all files.
* Preserve:

  * Type-only imports (TypeScript)
  * Imports used via JSX, dynamic usage, or side-effects
* Replace wildcard imports with specific imports when possible.

3. REMOVE UNUSED VARIABLES & FUNCTIONS

* Delete variables, constants, and functions that have zero references.
* Remove commented-out code blocks.
* Ensure no references remain after deletion.

4. REMOVE UNUSED EXPORTS

* Identify exports not imported anywhere in the repo.
* Remove unused named and default exports.
* Be careful with:

  * Next.js conventions (page.tsx, layout.tsx, generateMetadata, generateStaticParams)
  * Dynamic imports

5. DELETE UNUSED FILES (CAREFULLY)

* Identify files not referenced anywhere:

  * components, utils, hooks, scripts
* DO NOT delete:

  * Files under /app that define routes (page.tsx, layout.tsx, loading.tsx, not-found.tsx)
  * Files referenced via dynamic routing or config
* Provide a list of candidate files before deletion.

6. CLEAN UNUSED LIBRARIES (package.json)

* Detect dependencies not used in code:

  * Scan imports across repo
  * Compare against package.json
* Suggest removal of unused dependencies.
* Do NOT remove:

  * Peer dependencies required by Next.js
  * Tooling still in use (eslint, typescript, next, react, etc.)

7. NEXT.JS SAFETY RULES

* Do NOT break file-based routing.
* Preserve:

  * app/**/page.tsx
  * app/**/layout.tsx
  * generateStaticParams
  * metadata functions
* Ensure static export compatibility if `output: 'export'` is enabled.

8. TYPESCRIPT SAFETY

* Project must pass:

  * `npx tsc --noEmit`
* Avoid removing types that are indirectly used.

9. OUTPUT FORMAT
   Provide:

* List of removed imports (by file)
* List of removed variables/functions
* List of removed exports
* List of deleted files (with justification)
* Suggested package.json cleanup (dependencies to remove)
* Updated code snippets ONLY for changed files

10. FINAL VALIDATION

* After cleanup:

  * Run `npx tsc --noEmit`
  * Run `npm run build`
* If errors appear, revert unsafe removals and propose safer alternatives.

IMPORTANT:

* Prefer conservative, safe cleanup over aggressive deletion
* Do NOT break runtime behavior
* Do NOT assume unused if referenced dynamically

Goal:
Reduce codebase size, improve build performance, and maintain full functionality.


You are working on a Next.js (App Router) TypeScript project.

Project structure:
Content is stored as JSON files in nested folders:

public/data/locales/en/vedas/{veda}/{chapter}/{item}.json

Examples:

* vedas → main page
* vedas/atharvaveda → slug page
* vedas/atharvaveda/book1 → chapter page
* vedas/atharvaveda/book1/hymn.json → item page

Goal:
Update all `.tsx` pages to dynamically load and render JSON content based on the current route.

IMPORTANT RULES:

* DO NOT import JSON files directly
* Use runtime fetching (fetch API)
* Use `useLocale()` to get current locale
* Use `useLocaleSection()` only for fallback UI text (not main content)
* Handle missing files gracefully (no crashes)

---

1. CREATE GENERIC DATA LOADER

---

Create a helper:

getContentPath(locale, segments: string[])

It should return:
`/data/locales/${locale}/${segments.join('/')}.json`

Example:
segments = ['vedas','atharvaveda','book1','hymn']
→ /data/locales/en/vedas/atharvaveda/book1/hymn.json

---

2. FETCH DATA IN PAGE

---

In each page.tsx:

* Get params from route
* Build path segments dynamically
* Fetch JSON:

const res = await fetch(contentPath, { cache: 'force-cache' });

If file does not exist:

* return notFound()

---

3. ROUTE HANDLING

---

A. Main Page (/vedas)

* Load directory listing OR index JSON if exists
* Show list of vedas (folders)

B. Slug Page (/vedas/[slug])

* List chapters inside slug folder
* OR render slug-level JSON if exists

C. Chapter Page (/vedas/[slug]/[chapter])

* List items OR render chapter JSON

D. Item Page (/vedas/[slug]/[chapter]/[item])

* Load specific JSON file
* Render full content

---

4. DYNAMIC SEGMENTS SUPPORT

---

Use catch-all route:

[...segments]

Example:
params.segments = ['atharvaveda','book1','hymn']

---

5. SAFE RENDERING

---

* Use optional chaining:
  data?.title ?? 'Untitled'

* Render:
  title
  description
  content/body

---

6. FALLBACK HANDLING

---

If JSON not found:

* try loading folder index
* else return notFound()

---

7. UI STRUCTURE

---

* Title
* Breadcrumb (based on segments)
* Content
* List of child items (if folder)

---

8. PERFORMANCE

---

* Use:
  cache: 'force-cache'
* Avoid loading unnecessary files

---

9. OUTPUT EXPECTATION

---

Provide:

* Updated page.tsx for:

  * main page
  * dynamic catch-all page
* Helper function for path building
* Example rendering logic

---

## IMPORTANT

* DO NOT use fs in client components
* DO NOT import JSON directly
* DO NOT break static export compatibility
* Keep code clean and reusable

Goal:
Render correct JSON content dynamically based on route hierarchy, with robust fallback and clean UI.


You are working on a Next.js project using static export (`output: 'export'`), which generates an `out/` folder containing HTML files.

Goal:
Create a post-deploy audit script that scans the `out/` directory and validates SEO and Google indexing readiness for each generated page.

---

1. INPUT

---

* Root folder: `out/`
* Recursively scan all `.html` files

---

2. FOR EACH PAGE, VALIDATE:

---

A. BASIC SEO TAGS

* <title> exists and is not empty
* <meta name="description"> exists
* <link rel="canonical"> exists and is absolute URL

B. ROBOTS & INDEXING

* No <meta name="robots" content="noindex">
* If robots tag exists → ensure "index, follow"

C. OPEN GRAPH

* og:title
* og:description
* og:url
* og:type

D. TWITTER META

* twitter:card
* twitter:title
* twitter:description

E. STRUCTURED DATA

* Detect <script type="application/ld+json">
* Validate presence (not necessarily full schema validation)

F. CONTENT VALIDATION

* Ensure page has visible text content (not empty body)
* Detect if content is server-rendered (not empty HTML)

G. LINKS

* Extract all internal <a href>
* Ensure they are valid (no broken relative links)

---

3. OUTPUT FORMAT

---

Generate a report:

Option A: Console output

* Page path
* Status: PASS / WARN / FAIL
* List of issues

Option B: JSON report

* audit-report.json

Example:

{
"page": "/vedas/rigveda",
"status": "FAIL",
"issues": [
"Missing meta description",
"Missing canonical URL"
]
}

---

4. SCORING SYSTEM

---

Assign score per page:

* 100 = perfect
* Deduct points for missing elements

---

5. SUMMARY REPORT

---

At end, print:

* Total pages scanned
* Passed pages
* Failed pages
* Average SEO score

---

6. OPTIONAL ENHANCEMENTS

---

* Generate CSV report
* Highlight critical issues separately
* Detect duplicate titles/descriptions across pages

---

7. IMPLEMENTATION DETAILS

---

* Use Node.js
* Use fs to read files
* Use cheerio (or similar) to parse HTML
* Handle large number of pages efficiently

---

8. IMPORTANT

---

* Do NOT require a server (static analysis only)
* Must work on exported HTML only
* Must not crash on malformed HTML

---

## OUTPUT EXPECTATION

Provide:

* audit script (audit-seo.js)
* example output
* instructions to run

Goal:
Ensure every page in the static build is SEO-ready and indexable by Google.




You are working on a Next.js (App Router) TypeScript project with a large content system (Vedas, Itihasa, etc.) stored as JSON files.

Problem:
The app uses multiple dynamic routes ([slug], [id], [...segments]) and static export, causing:

* build failures (missing generateStaticParams)
* memory issues
* complex routing logic

Goal:
Refactor the entire routing system into a SINGLE universal dynamic route using `[...segments]`, driven by file-based JSON content.

---

1. REMOVE STATIC EXPORT

---

In next.config.ts:

* Remove:
  output: 'export'

---

2. CREATE SINGLE ROUTE

---

Create:

app/[...segments]/page.tsx

This route will handle ALL pages:

* /vedas
* /vedas/rigveda
* /vedas/rigveda/madala1
* /vedas/rigveda/madala1/hymn

---

3. DELETE OLD ROUTES

---

Remove:

* app/vedas/page.tsx
* app/vedas/[slug]/page.tsx
* app/vedas/[slug]/[chapter]/page.tsx
* any other nested dynamic routes

Ensure only `[...segments]` remains.

---

4. BUILD CONTENT RESOLVER

---

Create utility:

resolveContent(segments: string[], locale: string)

Behavior:

* Map URL segments → JSON file path

Example:

['vedas','rigveda','madala1','hymn']
→ /public/data/locales/en/vedas/rigveda/madala1/hymn.json

---

5. FETCH CONTENT

---

Inside page.tsx:

* Get params.segments
* Get locale using useLocale()
* Build path
* Fetch JSON:

const res = await fetch(path, { cache: 'force-cache' });

---

6. FALLBACK HANDLING

---

If JSON exists:

* Render content page

If JSON does NOT exist:

* Treat as folder
* List child folders/files

If neither:

* return notFound()

---

7. UI STRUCTURE

---

Render:

* Breadcrumb (based on segments)
* Title
* Content
* Children list (if folder)

---

8. SEO SUPPORT

---

Add generateMetadata():

* title from JSON
* description from JSON
* canonical from segments

---

9. PERFORMANCE

---

* Use cache: 'force-cache'
* Avoid loading unnecessary files
* No large imports

---

10. REMOVE generateStaticParams

---

* DO NOT use generateStaticParams anywhere
* This system must work without it

---

11. ENSURE CLEAN ARCHITECTURE

---

* No duplicate routing logic
* Single source of truth (file system)
* Minimal complexity

---

## OUTPUT EXPECTATION

Provide:

* app/[...segments]/page.tsx (complete)
* resolveContent utility
* example rendering logic
* example metadata function

---

## IMPORTANT

* Must work without static export
* Must handle large datasets
* Must not crash on missing data
* Must be scalable for 1000+ pages

Goal:
Create a universal, scalable routing system driven entirely by JSON content and URL segments.



You are a senior frontend architect specializing in Next.js and Tailwind CSS optimization at scale.

Objective:
Refactor the entire Next.js codebase to standardize and normalize Tailwind usage by replacing inconsistent, redundant, and unstructured utility classes with a clean, consistent, and professional Tailwind class system.

IMPORTANT CONSTRAINT:
- DO NOT create new CSS classes
- DO NOT create or modify any CSS/SCSS files
- DO NOT introduce semantic class names (e.g., .card, .btn)
- ONLY use Tailwind utility classes and existing project-defined Tailwind tokens/config

--------------------------------------------------
1. SCOPE
--------------------------------------------------
Apply to ALL files:
- /app
- /pages
- /components
- /layouts
- nested routes (including [...segments])
- JSX / TSX / MDX
- server + client components

--------------------------------------------------
2. CORE RULES
--------------------------------------------------

A. NO NEW STYLES
- Do NOT create:
  - globals.css additions
  - new class definitions
  - inline style objects
- Only refactor existing className strings

--------------------------------------------------

B. STANDARDIZE TAILWIND USAGE
- Replace inconsistent utilities with standardized equivalents

Example:
BEFORE:
className="px-3 py-2 p-4 pt-2"

AFTER:
className="px-4 py-2"

--------------------------------------------------

C. CONSISTENCY FIRST (CRITICAL)
Ensure uniform usage across the entire codebase:

Spacing scale:
- Prefer: px-4, px-6, py-2, py-3, py-4
- Avoid random values like px-5, py-7 unless already standardized

Margin:
- Use consistent vertical rhythm:
  - mb-2, mb-4, mb-6, mb-8
  - mt-2, mt-4, mt-6

Typography:
- Headings:
  - text-xl, text-2xl, text-3xl (consistent hierarchy)
- Body:
  - text-md sm:text-base, text-md sm:text-base
- Avoid mixing arbitrary sizes

--------------------------------------------------

D. COLOR SYSTEM (STRICT)
- Use ONLY existing Tailwind config colors (including temple palette if already defined)
- Replace:
  - arbitrary hex values → nearest configured color
  - inconsistent shades → standardized shade

Example:
- text-red-500 + text-red-600 mixed → choose ONE standard (e.g., text-red-600)

--------------------------------------------------

E. REMOVE DARK MODE
- Remove ALL:
  - dark:
  - dark:bg-*
  - dark:text-*
  - dark:border-*
- Ensure clean light-mode UI only

--------------------------------------------------

F. REMOVE REDUNDANCY
- Eliminate duplicate or conflicting utilities

Examples:
- "p-4 px-4" → "p-4"
- "flex flex-row" → "flex"
- "items-center items-start" → keep correct one only

--------------------------------------------------

G. NORMALIZE LAYOUT PATTERNS
Standardize common layouts:

Flex:
- flex items-center justify-between

Containers:
- max-w-7xl mx-auto px-4

Cards:
- rounded-lg border shadow-sm p-4

Buttons:
- px-4 py-2 rounded-md font-medium

--------------------------------------------------

H. PRESERVE RESPONSIVENESS
- Keep sm:, md:, lg:, xl:
- But normalize values across breakpoints

Example:
BEFORE:
text-md sm:text-base md:text-lg lg:text-xl

AFTER (if inconsistent):
text-md sm:text-base md:text-lg lg:text-xl

--------------------------------------------------

I. PRESERVE FUNCTIONALITY
- Do NOT modify:
  - logic
  - hooks
  - API calls
  - routing

--------------------------------------------------

3. STRICT MODE (MANDATORY)
--------------------------------------------------

- If className has >10 utilities → SIMPLIFY and NORMALIZE
- If inconsistent spacing/typography → FIX to standard scale
- If same UI pattern appears multiple times → make them visually consistent using SAME Tailwind utilities (NOT new classes)

--------------------------------------------------

4. PRIORITY ORDER
--------------------------------------------------

Refactor in this order:
1. Layout (flex/grid/container)
2. Spacing (padding/margin)
3. Typography
4. Colors
5. Borders/shadows
6. States (hover/focus)

--------------------------------------------------

5. OUTPUT REQUIREMENTS
--------------------------------------------------

- Return FULL updated files (no diffs)
- Maintain folder structure
- Ensure TypeScript compatibility
- No unused classes
- No visual breakage

--------------------------------------------------

6. VALIDATION CHECKLIST
--------------------------------------------------

✔ No new CSS classes created  
✔ No new style files created  
✔ No dark mode classes  
✔ Consistent spacing scale across app  
✔ Consistent typography scale  
✔ Consistent color usage  
✔ No redundant Tailwind utilities  
✔ Clean, professional className strings  

--------------------------------------------------

GOAL:
Transform the codebase into a highly consistent, maintainable, and professional Tailwind system using ONLY existing utilities and tokens, with zero new styles introduced.



You are a senior frontend architect specializing in Next.js and Tailwind CSS system consistency.

Objective:
Refactor the entire codebase to enforce a consistent typography system (font sizes, line heights, font weights, spacing) using ONLY Tailwind utility classes.

--------------------------------------------------
1. GLOBAL CONSTRAINTS (STRICT)
--------------------------------------------------

- DO NOT create any CSS files
- DO NOT add new classes
- DO NOT modify tailwind.config.js
- DO NOT introduce custom tokens
- ONLY use existing Tailwind utility classes
- DO NOT use dark mode variants

--------------------------------------------------
2. SCOPE
--------------------------------------------------

Apply to ALL files:
- /app
- /pages
- /components
- /layouts
- nested routes ([...segments])
- JSX / TSX / MDX

--------------------------------------------------
3. TYPOGRAPHY SYSTEM (MANDATORY STANDARD)
--------------------------------------------------

Use ONLY the following standardized scale:

H1 (Page Title):
- text-3xl/12 md:text-4xl/16
- font-semibold
- leading-tight
- tracking-tight

H2 (Section Title):
- text-2xl
- font-semibold
- leading-snug

H3 (Subsection):
- text-xl
- font-semibold
- leading-snug

Body (Primary Paragraph):
- text-md sm:text-base
- leading-relaxed

Secondary Text (Description / Subtitle):
- text-md sm:text-base
- leading-relaxed
- text-gray-600 or text-gray-700 (choose one consistently)

Small Text:
- text-sm
- leading-normal

--------------------------------------------------
4. LIST TYPOGRAPHY
--------------------------------------------------

Lists:
- list-disc pl-5
- text-md sm:text-base leading-relaxed

List Items:
- mb-1 or mb-2 (consistent choice)

--------------------------------------------------
5. SPACING CONSISTENCY
--------------------------------------------------

Titles:
- mb-4 (H1)
- mb-3 (H2)
- mb-2 (H3)

Paragraphs:
- mb-4

Sections:
- mt-6 or mt-8 (choose one consistently)

--------------------------------------------------
6. REPLACEMENT RULES (CRITICAL)
--------------------------------------------------

A. Replace inconsistent font sizes:

Examples:
- text-[15px] → text-md sm:text-base
- text-lg + text-md sm:text-base mixed → standardize to text-md sm:text-base (for body)
- text-4xl used randomly → restrict only to H1

--------------------------------------------------

B. Normalize line heights:

Examples:
- leading-6, leading-7 → replace with:
  - leading-relaxed (body)
  - leading-snug (headings)
  - leading-tight (H1)

--------------------------------------------------

C. Normalize font weights:

- Remove random font-semibold usage
- Use:
  - font-semibold (headings)
  - font-normal (body)

--------------------------------------------------

D. Remove redundancy:

Examples:
- "text-md sm:text-base text-md sm:text-base" → "text-md sm:text-base"
- "leading-relaxed leading-7" → "leading-relaxed"

--------------------------------------------------

E. Preserve responsiveness:

- Keep md: only for H1 scaling
- Avoid excessive breakpoint typography changes

--------------------------------------------------
7. STRICT MODE
--------------------------------------------------

- If typography is inconsistent → MUST fix
- If multiple styles used for same role → unify
- If unclear → default to body text standard

--------------------------------------------------
8. DO NOT TOUCH
--------------------------------------------------

- Colors (unless conflicting typography classes)
- Layout (flex, grid)
- Logic, hooks, API calls

--------------------------------------------------
9. OUTPUT REQUIREMENTS
--------------------------------------------------

- Return FULL updated files (no diffs)
- Maintain structure
- No unused classes
- Clean className strings

--------------------------------------------------
10. VALIDATION CHECKLIST
--------------------------------------------------

✔ One consistent typography scale across app  
✔ No arbitrary font sizes  
✔ No mixed line-height systems  
✔ Headings clearly differentiated  
✔ Paragraphs uniform  
✔ Lists consistent  
✔ No dark mode classes  

--------------------------------------------------
GOAL:
Transform the entire application into a clean, readable, and professional typography system using ONLY Tailwind utilities with zero custom styling.


You are a senior frontend architect specializing in Next.js and Tailwind CSS consistency at scale.

Objective:
Refactor the entire codebase to enforce a consistent spacing system using ONLY Tailwind utility classes (padding, margin, line-height, letter-spacing).

--------------------------------------------------
1. GLOBAL CONSTRAINTS (STRICT)
--------------------------------------------------

- DO NOT create CSS files
- DO NOT define new classes
- DO NOT modify tailwind.config.js
- ONLY use Tailwind utilities
- DO NOT use dark mode variants

--------------------------------------------------
2. SCOPE
--------------------------------------------------

Apply to ALL files:
- /app
- /pages
- /components
- /layouts
- nested routes ([...segments])
- JSX / TSX / MDX

--------------------------------------------------
3. SPACING SYSTEM (MANDATORY)
--------------------------------------------------

Use ONLY these spacing values across the app:

Padding:
- p-2, p-3, p-4, p-6
- px-4, px-6
- py-2, py-3, py-4, py-6

Margin:
- m-2, m-4, m-6
- mt-2, mt-4, mt-6, mt-8
- mb-2, mb-4, mb-6, mb-8

Gap:
- gap-2, gap-3, gap-4, gap-6

--------------------------------------------------
4. LINE HEIGHT (VERTICAL RHYTHM)
--------------------------------------------------

Use ONLY:

- leading-tight → main headings (H1)
- leading-snug → section titles
- leading-relaxed → paragraphs, lists
- leading-normal → small text

Replace:
- leading-6, leading-7, leading-8 → standardized values above

--------------------------------------------------
5. LETTER SPACING (TRACKING)
--------------------------------------------------

Use ONLY:

- tracking-tight → headings
- tracking-normal → body text
- tracking-wide → labels / UI elements

Remove:
- arbitrary tracking values
- inconsistent usage

--------------------------------------------------
6. SECTION SPACING RULES
--------------------------------------------------

Sections:
- mt-8 or mt-6 (choose ONE and apply globally)
- mb-8

Paragraphs:
- mb-4

Headings:
- H1 → mb-4
- H2 → mb-3 mt-6
- H3 → mb-2 mt-4

Lists:
- mb-4
- space-y-2 (preferred over manual margins)

--------------------------------------------------
7. CONTAINER CONSISTENCY
--------------------------------------------------

Standard container spacing:

- px-4 (mobile)
- md:px-6 (optional if already used)
- py-6 or py-8 (choose one consistently)

Remove:
- random px-5, px-7, py-10 etc.

--------------------------------------------------
8. REPLACEMENT RULES (CRITICAL)
--------------------------------------------------

A. Normalize padding:

Examples:
- px-5 → px-4 or px-6
- py-7 → py-6
- p-[18px] → p-4

--------------------------------------------------

B. Normalize margin:

Examples:
- mt-10 → mt-8
- mb-5 → mb-4 or mb-6

--------------------------------------------------

C. Remove conflicts:

Examples:
- "p-4 px-4" → "p-4"
- "mt-4 mt-6" → "mt-6"

--------------------------------------------------

D. Normalize gaps:

Examples:
- gap-5 → gap-4
- gap-7 → gap-6

--------------------------------------------------

E. Replace manual spacing patterns:

- Replace repeated mb-* stacks with:
  - space-y-2 or space-y-4 where applicable

--------------------------------------------------
9. STRICT MODE
--------------------------------------------------

- If spacing is inconsistent → MUST standardize
- If multiple values used for same purpose → unify
- If arbitrary values exist → replace with nearest standard

--------------------------------------------------
10. DO NOT TOUCH
--------------------------------------------------

- Colors
- Business logic
- API calls
- Routing

--------------------------------------------------
11. OUTPUT REQUIREMENTS
--------------------------------------------------

- Return FULL updated files (no diffs)
- Maintain structure
- Clean className strings
- No redundant utilities

--------------------------------------------------
12. VALIDATION CHECKLIST
--------------------------------------------------

✔ Consistent padding scale  
✔ Consistent margin scale  
✔ Unified line-height system  
✔ Unified letter-spacing system  
✔ No arbitrary spacing values  
✔ No conflicting classes  
✔ No dark mode usage  

--------------------------------------------------
GOAL:
Create a clean, consistent spacing system across the entire application using only Tailwind utilities, ensuring strong visual rhythm and readability.