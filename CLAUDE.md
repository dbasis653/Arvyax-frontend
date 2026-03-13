# Claude Instructions — Arvyax Frontend

## Project Context

- **Stack:** React 19 + Next.js 15 (App Router), JavaScript (JSX) — no TypeScript
- **Backend API:** Express 5 running at `http://localhost:5000`
- **Purpose:** AI-assisted journal system with LLM emotion/keyword/summary analysis
- **Backend uses:** JWT auth, Groq LLM, Prisma + PostgreSQL

---

## Environment Variables

- All public env vars must be prefixed with `NEXT_PUBLIC_`
- Access them via `process.env.NEXT_PUBLIC_*`
- `.env.local` is the correct file for local overrides (gitignored)
- Required var: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`

---

## Recommended File Structure

```txt
src/
  app/                 ← Next.js App Router (file-based routing)
    layout.js          ← root layout (wraps all pages)
    page.js            ← home route (/)
    globals.css        ← global styles
    <route>/
      page.js          ← route page component
      layout.js        ← optional nested layout
      loading.js       ← optional loading UI
      error.js         ← optional error UI
  components/
    ui/                ← generic reusable UI (Button, Input, Card, etc.)
    <feature>/         ← feature-specific components (journal/, auth/, insights/)
  hooks/               ← custom React hooks (useJournal.js, useAuth.js, etc.)
  services/            ← API client functions (api.js, journal.service.js, etc.)
  constants/           ← shared constants (AMBIENCE_OPTIONS, API_ROUTES, etc.)
  utils/               ← pure helper functions
  context/             ← React Context providers (AuthContext.jsx, etc.)
```

---

## Server Components vs Client Components

- By default, all components in `src/app/` are **Server Components** (no browser APIs, no hooks)
- Add `'use client'` at the top of a file when it uses:
  - React hooks (`useState`, `useEffect`, `useContext`, etc.)
  - Browser APIs (`window`, `document`, `localStorage`, etc.)
  - Event handlers (`onClick`, `onChange`, etc.)
- Keep Server Components for data fetching and layout; push `'use client'` as far down the tree as possible

---

## Code Separation Rules

### Constants

- Never define reusable values inline in components
- All constants go in `src/constants/<topic>.js`
- Examples: `AMBIENCE_OPTIONS` (forest|ocean|mountain), `API_ROUTES`, `MAX_JOURNAL_LENGTH` (5000)

### Components

- If a UI pattern appears more than once, extract it to `components/ui/`
- Feature-specific components go in `components/<feature>/`
- One-off page UI that has no reuse potential can stay in the page file

### Services (API Layer)

- All `fetch` calls go in `src/services/` — components never call `fetch` directly
- Base fetch wrapper in `src/services/api.js` (sets base URL, auth headers, error handling)
- Feature services: `src/services/journal.service.js`, `src/services/user.service.js`

---

## Backend API Reference

Base URL comes from: `process.env.NEXT_PUBLIC_API_BASE_URL`

| Method | Path                          | Purpose                                                                       |
| ------ | ----------------------------- | ----------------------------------------------------------------------------- |
| POST   | /api/users                    | Create user (`username` required)                                             |
| POST   | /api/journal                  | Create journal entry — triggers LLM analysis (`username`, `text`, `ambience`) |
| GET    | /api/journal/:username        | Fetch all entries for a user                                                  |
| POST   | /api/journal/analyze          | Standalone text analysis (`text` required)                                    |
| GET    | /api/journal/insights/:userId | Aggregate insights for a user                                                 |

- LLM endpoints (`/api/journal`, `/api/journal/analyze`) are rate-limited: 10 req/15 min
- Always include `Content-Type: application/json` on POST requests
- JWT token goes in `Authorization: Bearer <token>` header

---

## State Management

- Use React Context + `useReducer` for global state (auth, current user)
- Keep local UI state in `useState` inside Client Components
- Avoid prop drilling more than 2 levels — lift to context instead
- Do not add Redux or MobX unless complexity clearly demands it

---

## Routing

- Routing is file-based via the `src/app/` directory — no routing library needed
- Each folder with a `page.js` becomes a route (e.g. `src/app/journal/page.js` → `/journal`)
- Use Next.js `<Link>` for navigation — never `<a href>` or `window.location`
- Use `redirect()` from `next/navigation` for programmatic redirects in Server Components
- Use `useRouter()` from `next/navigation` for programmatic navigation in Client Components

---

## Styling

- Vanilla CSS with CSS custom properties for theming
- Global styles in `src/app/globals.css`, component styles co-located as `ComponentName.css`
- No inline `style={{}}` props unless the value is truly dynamic
- Use class names, not IDs, for styling

---

## Code Comments

### Functions and Hooks

- Every non-trivial function must have a comment explaining what it does and what it returns:
  ```js
  // Submits the journal entry to the backend and returns the analysis result.
  // Throws on network error or non-2xx response.
  async function createJournalEntry(username, text, ambience) { ... }
  ```

### JSX Sections

- Label major JSX blocks with `{/* ── Section Name ── */}` style comments

### What NOT to comment

- Self-evident one-liners (`useState`, simple assignments)
- Explain the _why_, not the _what_ — never restate the code in English
- No comments above import statements

---

## Naming Conventions

- Files: `camelCase.js` for utils/services/hooks, `PascalCase.jsx` for components
- Next.js special files (`page.js`, `layout.js`, `loading.js`, `error.js`) are always lowercase
- Hooks: always prefix with `use` (e.g. `useJournal`, `useAuth`)
- Constants: `UPPER_SNAKE_CASE`
- CSS classes: `kebab-case`

---

## Error Handling

- Show user-friendly messages for API errors — never raw error objects in UI
- Handle these cases explicitly:
  - Network failure (fetch throws) — "Could not connect to server"
  - Rate limiting (429) — "Too many requests, please try again in a few minutes"
  - Validation errors (400) — show which field failed
- Every async operation must have a loading state

---

## Security

- Never store JWT tokens in `localStorage` — use memory or `httpOnly` cookies
- Never log sensitive journal text to the console in production
- Avoid `dangerouslySetInnerHTML` — sanitize any user-generated content before rendering
- All secrets come from `process.env.*` — never hardcode API keys or URLs
- Server-only secrets (no `NEXT_PUBLIC_` prefix) are never exposed to the browser

---

## General Principles

- Keep components focused: one responsibility per component
- Co-locate related files (component + its CSS + its hook)
- Prefer named exports over default exports for components (exception: Next.js page/layout files require default exports)
- Before writing a constant, component, or utility inline — ask: "Could this be needed elsewhere?" If yes, extract it to the right shared location immediately
