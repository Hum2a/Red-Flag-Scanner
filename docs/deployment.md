# Deploying Red Flag Scanner on Render

This project is a **Vite + React** frontend and a **Node + Express** API in `server/`, with **SQLite** (`better-sqlite3`) and native **sharp** image processing. On Render, the practical setup is **two services**: a **Web Service** for the API and a **Static Site** for the built frontend.

---

## Why two services?

- Local dev uses Vite’s proxy so the browser calls `/api` on the same origin.
- In production, the static site is served from a CDN URL; API calls must go to the API’s public URL.
- The frontend reads `VITE_API_BASE_URL` (see `src/lib/api.ts`). That value must be set **at build time** for the static site so `fetch` targets your API.

---

## 1. Deploy the API (Web Service)

1. In the [Render Dashboard](https://dashboard.render.com), create a **New +** → **Web Service**.
2. Connect the same Git repository as this project.
3. Configure:

   | Setting | Value |
   |--------|--------|
   | **Root directory** | `server` |
   | **Runtime** | Node |
   | **Build command** | `npm install && npm run build` |
   | **Start command** | `npm start` |

4. **Environment variables** (Environment → Add):

   | Key | Value / notes |
   |-----|----------------|
   | `NODE_ENV` | `production` |
   | `PORT` | Leave unset; Render injects `PORT`. The app already uses `process.env.PORT`. |
   | `FRONTEND_URL` | Your static site origin only, e.g. `https://your-app-name.onrender.com` — must match the browser origin **exactly** (scheme + host, no path). Used by CORS in `server/src/index.ts`. |
   | `DATABASE_PATH` | Optional. Default without it: `data/scanner.db` under the service working directory. See [SQLite and persistence](#sqlite-and-persistence) below. |

5. Deploy and copy the service URL (e.g. `https://red-flag-scanner-api.onrender.com`). You will use it in the next step.

**Note:** On the free tier, Web Services can **spin down** after idle time; the first request after idle may be slow (cold start).

---

## 2. Deploy the frontend (Static Site)

1. **New +** → **Static Site**, same repository.
2. Configure:

   | Setting | Value |
   |--------|--------|
   | **Root directory** | *(empty / repository root)* |
   | **Build command** | `npm install && npm run build` |
   | **Publish directory** | `dist` |

3. **Environment variables** for the build:

   | Key | Value |
   |-----|--------|
   | `VITE_API_BASE_URL` | Full API base URL **without a trailing slash**, e.g. `https://red-flag-scanner-api.onrender.com` |

4. Deploy.

### Client-side routing (React Router)

Direct visits or refreshes on paths like `/r/abc` need the CDN to serve `index.html` for those paths.

- In the static site’s **Redirects/Rewrites** (dashboard), add a **rewrite**:
  - **Source:** `/*`
  - **Destination:** `/index.html`
  - **Action:** Rewrite  

Or define the same in `render.yaml` (see [Optional Blueprint](#optional-blueprint-renderyaml)).

---

## 3. Finish wiring CORS

After the static site has its final URL:

1. Open the **Web Service** → **Environment**.
2. Set `FRONTEND_URL` to that URL (e.g. `https://your-static-site.onrender.com`).
3. **Save**; Render will redeploy the API.

If `FRONTEND_URL` does not match the site you open in the browser, the browser will block API requests (CORS).

---

## SQLite and persistence

Render’s filesystem for a Web Service is **ephemeral**: redeploys can reset the disk unless you use a [**persistent disk**](https://render.com/docs/disks).

- **Accept data loss on redeploy:** omit `DATABASE_PATH` or keep a path under the app directory.
- **Keep SQLite across deploys:** attach a disk (e.g. mount `/var/data`) and set:

  `DATABASE_PATH=/var/data/scanner.db`

The server creates the parent directory if needed (`server/src/db/schema.ts`).

---

## Native modules (Node version)

The API depends on **better-sqlite3** and **sharp**, which compile native code. Render’s default Node version usually works; if builds fail, set **`NODE_VERSION`** (or use an `engines` field in `server/package.json`) to an LTS version such as `22` in the Web Service environment.

---

## Optional Blueprint (`render.yaml`)

You can define both services in a Blueprint at the repo root. Adjust names and use a real API URL for `VITE_API_BASE_URL` after the first API deploy, or redeploy the static site when the API URL changes.

```yaml
services:
  - type: web
    name: red-flag-scanner-api
    runtime: node
    rootDir: server
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        sync: false  # Set in dashboard: your static site URL
      # Optional: persistent SQLite
      # - key: DATABASE_PATH
      #   value: /var/data/scanner.db
    # disk:  # Uncomment and configure in dashboard if using DATABASE_PATH on a mount
    #   name: data
    #   mountPath: /var/data
    #   sizeGB: 1

  - type: web
    name: red-flag-scanner-web
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_BASE_URL
        sync: false  # e.g. https://red-flag-scanner-api.onrender.com
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

Create the Blueprint from the Render dashboard if you use this file; see [Render Blueprint spec](https://docs.render.com/docs/blueprint-spec).

---

## Checklist

- [ ] Web Service: root `server`, build + start as above.
- [ ] Static Site: publish `dist`, `VITE_API_BASE_URL` points at the API (no trailing slash).
- [ ] `FRONTEND_URL` on the API matches the static site URL exactly.
- [ ] SPA rewrite `/*` → `/index.html` on the static site.
- [ ] Optional: persistent disk + `DATABASE_PATH` if you need SQLite to survive redeploys.

---

## Troubleshooting

| Symptom | Likely cause |
|--------|----------------|
| API works in browser directly but not from the site | Wrong `VITE_API_BASE_URL` or `FRONTEND_URL` / CORS mismatch. Rebuild static site after changing the API URL. |
| 404 on refresh for `/r/...` or other routes | Missing SPA rewrite to `/index.html`. |
| API build fails on `sharp` / `better-sqlite3` | Pin Node with `NODE_VERSION` or `engines` and clear build cache. |
| History or stats reset after each deploy | SQLite on ephemeral disk; add a persistent disk and `DATABASE_PATH`. |
