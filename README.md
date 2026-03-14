# Arvyax — Frontend

Next.js frontend for the Arvyax AI-assisted journaling system. Users write journal entries, trigger live LLM analysis (streamed word by word), and view emotion insights.

---

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4

---

## Prerequisites

- Node.js v18+
- The [Arvyax backend](https://github.com/your-org/arvyax-backend) running on port 5000

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

## What It Does

- **Login page** — enter a username to access your journal
- **Journal page** — write entries with an ambience (forest / ocean / mountain)
- **Live analysis** — click Analyze on any entry to stream the LLM summary word by word
- **Insights panel** — top emotion, most used ambience, recent keywords across all entries
