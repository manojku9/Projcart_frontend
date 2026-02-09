# Project Showcase Frontend

A polished, fast React app for showcasing projects, managing a personal dashboard, and sharing work with the community. Built with Vite + TypeScript and designed to pair with the backend API in this repo.

---

## Highlights

- Auth flows for email/password plus Google and GitHub OAuth.
- Personal dashboard to create, edit, and delete projects.
- Project cards with screenshots and link previews.
- Sorting and browsing the full public project list.
- Responsive layout optimized for mobile and desktop.

---

## Tech Stack

- React 19 + TypeScript
- Vite for dev server and production builds
- Axios for API calls
- React Router for client-side routing

---

## Quick Start

```bash
# from frontend/project-showcase-frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Environment Variables

Create a `.env` file at the project root (same level as `package.json`):

```bash
VITE_BACKEND_URL=http://localhost:5000
# Optional override for the API prefix
VITE_API_URL=http://localhost:5000/api
```

Notes:
- `VITE_BACKEND_URL` is used for OAuth redirect links.
- `VITE_API_URL` is optional. If omitted, the app uses `VITE_BACKEND_URL/api`.

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Typecheck + production build
npm run preview  # Preview production build
npm run lint     # Lint the codebase
```

---

## App Structure

```
src/
  components/    # Reusable UI blocks (Navbar, ProjectCard, etc.)
  pages/         # Route-level screens (Home, Dashboard, Login, etc.)
  services/      # API client and helpers
  types/         # Shared TypeScript types
```

---

## Backend Pairing

This frontend expects the backend API from the `backend/` folder in the same repo. Make sure the backend is running and that your environment variables point to it.

---

## Deployment

The app is Vercel-ready. The included `vercel.json` handles SPA rewrites.

---

## License

MIT (update as needed)
