# License Agreement

## Proprietary Rights
All content, source code, designs, images, and assets within this repository are the exclusive property of the repository owner.

## Restrictions
You are **NOT** permitted to:
- Copy, clone, fork, or redistribute any part of this repository.
- Reuse, modify, or adapt any code, assets, or materials for personal or commercial purposes.
- Misuse or exploit any content in any form.

## Usage
Access to this repository is provided for viewing purposes only. Any unauthorized use, reproduction, or distribution is strictly prohibited and may result in legal action.

## Permissions
If you wish to use any part of this repository, you must obtain **explicit written permission** from the owner.

© 2025 Repository Owner. All rights reserved.


## Legal Penalties
Unauthorized use, copying, redistribution, or misuse of any content in this repository constitutes a violation of intellectual property rights.
Violators may be subject to:
- Civil liability, including compensatory and punitive damages.
- Criminal prosecution under applicable laws.
- Payment of all legal costs incurred by the repository owner in enforcing these rights.

By accessing this repository, you agree to comply with these terms. Failure to do so may result in immediate legal action.


## Contact Information
For inquiries, permissions, or to report misuse of this repository, please contact:
**Email:** vulchi.vijay@gmail.com


## Build notes

- Baseline browser mapping warning:
	- If you see the message:
		```
		[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
		```
		run the following to update the dev dependency locally (safe and recommended):
		```powershell
		npm i baseline-browser-mapping@latest -D
		npm run build
		```

- Static export vs server build (`NEXT_STATIC_EXPORT`):
	- This repository can be built either as a server-capable Next app (API routes and middleware available) or as a static export (HTML-only) used for static hosts. The build mode is controlled by the environment variable `NEXT_STATIC_EXPORT`.
	- When `NEXT_STATIC_EXPORT=true` the build sets `output: 'export'` which disables API routes and middleware. If you rely on API routes (for analytics/cookies) or middleware, do NOT set `NEXT_STATIC_EXPORT=true`.
	- To build as a server-capable app (default), ensure the env var is not set or set it to `false` before running `npm run build`:
		```powershell
		Remove-Item Env:NEXT_STATIC_EXPORT
		npm run build
		```
	- In CI, avoid setting `NEXT_STATIC_EXPORT=true` unless you intentionally want a static-only export. If using static export in CI for a static host, document this choice in your pipeline config so other maintainers are aware.

If you'd like, I can also pin an updated `baseline-browser-mapping` version in `package.json` for you to `npm install` locally. Let me know if you want me to do that.