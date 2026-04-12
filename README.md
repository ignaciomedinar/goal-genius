# ⚽ Goal Genius

Advanced football match predictions with AI-powered accuracy analysis.

## Features

- **Weekly Predictions** — AI-generated match predictions with confidence scores and liability ratings
- **Results Tracker** — Historical results with accuracy metrics (overall & top-10 breakdown)
- **League Stats** — KPI cards per confederation and league with prediction accuracy
- **Country Flags** — Visual league identification across all tables
- **Export** — Download filtered predictions or results as CSV

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Railway (read-only predictions DB) |
| Deployment | Heroku (Node.js buildpack) |

## Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/goal-genius.git
   cd goal-genius
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local`** (never committed)
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
   NEXT_PUBLIC_APP_NAME=Goal Genius
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_DESCRIPTION=Advanced football match predictions with AI-powered accuracy analysis
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Verify DB connection**
   ```
   GET /api/test-db  →  { "success": true }
   ```

## Deployment (Heroku)

Environment variables are set via the Heroku CLI — **never committed to the repo**.

```bash
# Link to your existing Heroku app
heroku git:remote -a <your-heroku-app-name>

# Set config vars
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set NEXT_PUBLIC_APP_NAME="Goal Genius"
heroku config:set NEXT_PUBLIC_APP_URL="https://www.goal-genius.net"
heroku config:set NEXT_PUBLIC_APP_DESCRIPTION="Advanced football match predictions with AI-powered accuracy analysis"
heroku config:set NODE_ENV="production"

# Ensure Node.js buildpack
heroku buildpacks:set heroku/nodejs

# Push & deploy
git push heroku main

# Tail logs
heroku logs --tail
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── predictions/page.tsx  # Current week predictions
│   ├── results/page.tsx      # Historical results
│   └── api/                  # API routes (predictions, results, stats…)
├── components/               # React components per page section
├── lib/
│   └── database.ts           # PostgreSQL query functions
└── types/
    └── index.ts              # Shared TypeScript types
```

## Database Refresh

- **Predictions** — updated daily/bi-daily in `fact_match_predictions`
- **Results** — populated automatically when match goals are recorded in `fact_match_results`
- **Accuracy** — calculated dynamically; no manual intervention needed

## License

Private — all rights reserved.
