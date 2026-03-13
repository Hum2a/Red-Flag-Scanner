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

Copy `server/.env.example` to `server/.env`. For Instagram, create an app at [developers.facebook.com](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/getting-started):

```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/scanner.db
SESSION_SECRET=change-this-in-production
FRONTEND_URL=http://localhost:5173
INSTAGRAM_APP_ID=your-app-id
INSTAGRAM_APP_SECRET=your-app-secret
INSTAGRAM_REDIRECT_URI=http://localhost:5173/api/auth/instagram/callback
```

**Note:** Instagram's API only supports Business and Creator accounts. Both the connecting user and the profile being scanned must be professional accounts.

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

- **Photo upload** — Drag and drop or click to upload a photo. Get AI-generated red flags.
- **Scan history** — View recent scans and expand to see past flags.

## Project structure

```
├── src/           # Frontend (React + Vite)
├── server/        # Backend (Express)
├── .cursor/       # Cursor rules and agent instructions
└── PROJECT_PLAN.md
```

See `PROJECT_PLAN.md` for the full implementation roadmap.
