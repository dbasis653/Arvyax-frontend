# Arvyax — Frontend

**Live demo:** [arvyax-ai-journal.vercel.app](https://arvyax-ai-journal.vercel.app)

Next.js frontend for the Arvyax AI-assisted journaling system. Users write journal entries, trigger live LLM analysis (streamed word by word), and view emotion insights.

---

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4

---

## Prerequisites

- Node.js v18+
- The Arvyax backend running on port 5000 (local) or at https://arvyax-backend-ymgk.onrender.com (production)

---

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## Install & Run

```bash
npm install

npm run dev          # development (http://localhost:3000)
npm run build        # production build
npm start            # serve production build
```

---

## Bonus Features Implemented

- **Streaming LLM response** — analysis streams word by word via SSE, rendered live in the UI
- **Caching analysis results** — repeated analysis of identical text is served from cache (no LLM call)
- **Rate limiting** — LLM endpoints limited to 10 requests per 15 minutes per IP
- **Deployed demo** — live at [arvyax-ai-journal.vercel.app](https://arvyax-ai-journal.vercel.app)

---

## What It Does

- **Login page** — enter a username to access your journal
- **Journal page** — write entries with an ambience (forest / ocean / mountain)
- **Live analysis** — click Analyze on any entry to stream the LLM summary word by word
- **Insights panel** — top emotion, most used ambience, recent keywords across all entries
