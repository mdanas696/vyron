# VYRON

A personal calendar + habit tracker, built to actually get finished — shipped in small sprints instead of all at once.

## Stack

- **Frontend:** React (Vite) → deploy to Vercel
- **Backend:** Node/Express → deploy to Render or Railway
- **Database:** MongoDB → MongoDB Atlas (free tier)

## Sprint 1 — done in this drop

- User auth (register/login, JWT, bcrypt password hashing)
- Protected `/dashboard` route
- Design system wired in from day one (see `frontend/src/styles/theme.css`)
- Student vs. working-professional account type captured at signup (used later for the finance-mode branch)

## Running it locally

**Backend**
```
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # http://localhost:5000
```

**Frontend**
```
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

## Deploying

1. **MongoDB Atlas** — create a free cluster, get the connection string, add it as `MONGO_URI`.
2. **Backend → Render/Railway** — set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL once you have it) as environment variables.
3. **Frontend → Vercel** — import the `frontend/` folder as the project root, set `VITE_API_URL` to your deployed backend's `/api` URL.

## Roadmap

- **Sprint 2 — Calendar core:** events/appointments/tasks CRUD, priority tags, day view
- **Sprint 3 — Tracker core:** custom habit rows, month-as-columns grid, multi-state marking (done / partial / missed)
- **Sprint 4 — Insights:** monthly % completion, consistency chart, reminders/alarms
- **Later:** friends/global leaderboards, chatbot advisor, screen-time screenshot analyzer, working-professional finance mode

## Design tokens

Colors, fonts, radius, and spacing are all defined once in `frontend/src/styles/theme.css` as CSS variables — change the palette or type there and it propagates everywhere.
