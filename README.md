# Red Flag Scanner

A satirical web app that analyzes photos or Instagram profiles and generates "red flags" using AI.

## Tech Stack

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite
- **Matching**: Rule-based image analysis + curated red flags dataset

## Setup

### 1. Install dependencies

```bash
npm install
cd server && npm install
```

### 2. Configure environment

Copy `server/.env.example` to `server/.env`:

```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/scanner.db
FRONTEND_URL=http://localhost:5173
```

### 3. Run the app

**Terminal 1 — Backend:**
```bash
npm run dev:server
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open http://localhost:5173. The frontend proxies `/api` and `/health` to the backend.

## Features

- **Photo upload** — Drag and drop or click to upload a photo. Get red flags from image analysis.
- **Profile scan** — Enter Instagram, TikTok, or X username. Satirical analysis (no real API).
- **Compare mode** — Compare two profiles side by side.
- **Share results** — Copy, share, or export as image. Shareable links at `/r/:id`.
- **Scan again** — Get different flags for the same username (random mode).
- **Stats** — Total profiles scanned.
- **404 page** — Custom error page.

## Project structure

```
├── src/           # Frontend (React + Vite)
├── server/        # Backend (Express)
├── .cursor/       # Cursor rules and agent instructions
└── PROJECT_PLAN.md
```

See `PROJECT_PLAN.md` for the full implementation roadmap.
