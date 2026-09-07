# BIZORA — GitHub Pages Deployment

## What this setup does

- Builds the React/Vite frontend with Vite.
- Automatically uses the GitHub repository name as the Pages base path.
- Deploys `dist/` through GitHub Actions.
- Keeps the existing Express/MongoDB backend separate.
- Supports an optional `VITE_API_BASE_URL` GitHub repository variable for the backend.

## Deploy

1. Create/use the GitHub repository that will host BIZORA (for example `bizora-website`).
2. Upload the contents of this project to the repository root and push to the `main` branch.
3. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The workflow at `.github/workflows/deploy.yml` will build and deploy the frontend.

## Backend

GitHub Pages cannot run the Express server or MongoDB. If the shop needs products, orders, login, admin, CMS, uploads, etc., deploy `server.ts` and MongoDB separately.

Then create a GitHub repository variable:

- `VITE_API_BASE_URL` = your public Express API origin, e.g. `https://api.example.com`
- `VITE_ASSET_BASE_URL` = the public origin serving `/uploads` when uploads are hosted outside GitHub Pages

Do not put database credentials or JWT secrets in frontend/Vite variables.

## Local full-stack development

Use the existing `bun.lock` and run:

```bash
bun install
bun run dev
```

For a frontend-only production build:

```bash
bun run build
```

For the full server bundle:

```bash
bun run build:full
```
