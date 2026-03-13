# Red Flag Scanner — Project Plan

A satirical web app that analyzes photos or Instagram profiles and generates "red flags" using AI. Built with React + Vite + Tailwind (frontend) and Node.js (backend).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS |
| Backend | Node.js (Express or Fastify), TypeScript |
| Database | SQLite (dev) / PostgreSQL (prod) — or start with SQLite for simplicity |
| AI | OpenAI GPT-4 Vision or Claude Vision (for image analysis) |
| Instagram | Meta Instagram Graph API (Instagram Login flow) |

---

## Important: Instagram API Limitation

**Meta's Instagram API does NOT support looking up arbitrary public profiles by username.** You cannot pass `@someuser` and fetch their profile without their consent.

**Supported approach:** Use **Instagram Login** — the user authenticates with their own Instagram account, and we fetch their profile + media with their permission. This works for:
- Users analyzing their own profile
- Users who paste a photo/screenshot of someone else's profile (we analyze the image with vision AI instead)

**Dual input strategy:**
1. **Photo upload** — User uploads a photo or screenshot → Vision AI generates red flags (always works)
2. **Instagram connect** — User logs in with Instagram → We fetch their profile/media → AI generates red flags from bio, captions, etc.

---

## Project Structure

```
red-flag-scanner/
├── src/                    # Frontend (React + Vite)
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── App.tsx
├── server/                 # Backend (Node.js)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── db/
│   │   └── index.ts
│   └── package.json
├── .cursor/
│   ├── rules/              # Cursor rules per stack
│   └── AGENTS.md
├── package.json            # Root (optional: workspace)
└── PROJECT_PLAN.md
```

---

## Phase 1: Foundation (Week 1)

### 1.1 Frontend Setup
- [ ] Add Tailwind CSS to the existing Vite + React project
- [ ] Configure path aliases (`@/components`, etc.)
- [ ] Set up base layout: header, main content area, footer
- [ ] Create design tokens (colors, typography) in Tailwind config
- [ ] Add a simple landing page with CTA

### 1.2 Backend Setup
- [ ] Create `server/` directory with its own `package.json`
- [ ] Initialize Express (or Fastify) with TypeScript
- [ ] Set up environment variables (`.env` with `PORT`, `NODE_ENV`)
- [ ] Add health check endpoint: `GET /health`
- [ ] Configure CORS for frontend origin

### 1.3 Database Setup
- [ ] Choose DB: SQLite (via `better-sqlite3` or `drizzle`) for simplicity
- [ ] Create `scanned_accounts` table: `id`, `identifier` (username or "photo"), `created_at`, `red_flags` (JSON)
- [ ] Add migration/seed script
- [ ] Create a simple service to insert and query scanned accounts

---

## Phase 2: Photo Upload Flow (Week 2)

### 2.1 Frontend
- [ ] Photo upload component: drag-and-drop + file picker
- [ ] Image preview before submit
- [ ] Loading state while analyzing
- [ ] Results display: list of red flags with styling
- [ ] Error handling (file too large, invalid format)

### 2.2 Backend
- [ ] `POST /api/analyze/photo` — accepts multipart image
- [ ] Validate file type (jpg, png, webp) and size (e.g. max 5MB)
- [ ] Integrate OpenAI GPT-4 Vision or Claude Vision API
- [ ] Prompt engineering: generate 3–7 playful "red flags" from the image
- [ ] Store result in `scanned_accounts` with `identifier: "photo"` or a hash
- [ ] Return `{ redFlags: string[] }` to frontend

### 2.3 AI Integration
- [ ] Add OpenAI/Anthropic SDK to server
- [ ] Create `services/ai.ts` with `analyzeImage(imageBuffer: Buffer): Promise<string[]>`
- [ ] Use structured output (JSON mode) for consistent response format

---

## Phase 3: Instagram Integration (Week 3)

### 3.1 Meta Developer Setup
- [ ] Create Meta App at developers.facebook.com
- [ ] Add Instagram Login product
- [ ] Configure OAuth redirect URIs
- [ ] Get `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET`

### 3.2 Backend OAuth Flow
- [ ] `GET /api/auth/instagram` — redirect to Instagram OAuth URL
- [ ] `GET /api/auth/instagram/callback` — exchange code for access token
- [ ] Exchange short-lived token for long-lived (60 days)
- [ ] Store tokens securely (encrypted or in DB with user session)

### 3.3 Fetch Profile & Media
- [ ] `GET /me?fields=id,username,media_count,account_type` (or equivalent)
- [ ] `GET /me/media?fields=id,caption,media_type,media_url` — fetch recent posts
- [ ] Aggregate: username, bio (if available), captions from posts
- [ ] Pass text + optionally first few media URLs to AI for analysis

### 3.4 Frontend
- [ ] "Connect Instagram" button → redirects to backend auth route
- [ ] After callback, redirect back to app with success
- [ ] Show "Analyzing @username..." loading state
- [ ] Display red flags same as photo flow

### 3.5 Storage
- [ ] Store `identifier: username` in `scanned_accounts` when analyzing Instagram
- [ ] Optional: cache profile data to avoid re-fetching on repeat scans

---

## Phase 4: History & Polish (Week 4)

### 4.1 Scan History
- [ ] Backend: `GET /api/history` — list recent scanned accounts (paginated)
- [ ] Frontend: "Recent scans" section or dedicated page
- [ ] Show identifier + timestamp; link to view past results
- [ ] Optional: `GET /api/history/:id` for full past result

### 4.2 UI/UX Polish
- [ ] Responsive design (mobile-first)
- [ ] Accessible forms and buttons (ARIA, focus states)
- [ ] Consistent error messages and empty states
- [ ] Optional: share results (copy link, social share)

### 4.3 DevOps & Deployment
- [ ] Dockerfile for server
- [ ] Frontend: `vite build` → static hosting (Vercel, Netlify)
- [ ] Backend: deploy to Railway, Render, or Fly.io
- [ ] Environment variables for production
- [ ] Optional: switch to PostgreSQL for production DB

---

## API Contract Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/analyze/photo` | Upload image, get red flags |
| GET | `/api/auth/instagram` | Start Instagram OAuth |
| GET | `/api/auth/instagram/callback` | OAuth callback |
| POST | `/api/analyze/instagram` | Analyze connected user (after auth) |
| GET | `/api/history` | List scanned accounts |
| GET | `/api/history/:id` | Get past scan result |

---

## Environment Variables

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:3001
```

### Backend (`.env`)
```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/scanner.db

# AI (choose one)
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...

# Instagram
INSTAGRAM_APP_ID=...
INSTAGRAM_APP_SECRET=...
INSTAGRAM_REDIRECT_URI=http://localhost:3001/api/auth/instagram/callback
```

---

## Dependencies to Add

### Frontend
- `tailwindcss`, `postcss`, `autoprefixer`
- `react-router-dom` (if multi-page)
- `@tanstack/react-query` (optional, for data fetching)

### Backend
- `express` or `fastify`
- `cors`
- `dotenv`
- `multer` (file upload)
- `openai` or `@anthropic-ai/sdk`
- `better-sqlite3` + `drizzle-orm` (or `prisma`)
- `axios` (for Instagram API calls)

---

## Cursor Rules

Project-specific rules live in `.cursor/rules/` and cover:
- React + TypeScript patterns
- Tailwind usage
- Node.js backend conventions
- API design
- General coding standards

See `.cursor/AGENTS.md` for high-level agent instructions.
