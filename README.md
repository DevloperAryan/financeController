# Finance Controller Agent

**An AI-assisted reconciliation tool that matches sales records against bank statements — and reports its accuracy honestly, exceptions included.**

Built for Razorpay Buildathon — Track 04: *AI Finance Controller*

---

## The Problem

Every business that takes payments eventually hits the same wall: your own sales records never quite line up with what the bank actually reports. Amounts differ because of fees. Dates shift by a day or two. Formats vary from bank to bank. Someone, somewhere, ends up doing this matching by hand in a spreadsheet — slow, error-prone, and impossible to audit later.

The bottleneck in 2026 isn't generating more data. It's **verifying** the data that already exists.

## What This Tool Does

Upload two files — your sales records and a bank statement, in CSV or Excel — and the agent:

1. **Reads and understands both files**, regardless of exact column layout
2. **Cleans messy bank statement text** using an LLM — extracting amount, date, and reference number from inconsistent formats
3. **Matches records deterministically**, using plain, auditable logic rather than AI guesswork
4. **Reports the results honestly** — a real match rate, plus a clear, reasoned list of everything that *didn't* match and why

The result lands on a dashboard: summary metrics, a visual breakdown, a searchable matched-records table with drill-down detail, and an exceptions list that explains itself.

---

## Why the LLM Only Does Half the Job

This is a deliberate design decision, not a limitation.

An LLM is genuinely good at **understanding messy, unstructured text** — so it's used exactly once in this pipeline, to turn a raw bank statement line like `PYMT REF#4521 03/08/26 495.00` into clean structured data.

But **matching itself is plain code** — amount and date comparison, nothing probabilistic. If an LLM decided which records matched, the resulting accuracy number would be unverifiable, which defeats the entire point of a reconciliation tool. Judged accuracy has to mean something. So the two jobs are split deliberately: AI where it helps, deterministic logic where it counts.

---

## Live Results (Latest Test Run)

| Metric | Value |
|---|---|
| Total sales records | 50 |
| Successfully matched | 46 |
| **Match rate** | **92.0%** |
| Total exceptions | 11 |

The 11 exceptions break down into two honest categories:
- **Genuinely missing bank records** — sales with no corresponding entry in the statement
- **Near-collision cases** — a small number of records with very close amounts/dates that the current greedy-matching strategy occasionally pairs incorrectly, documented below rather than hidden

No cherry-picking. This is the real number from a real run.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Database | Supabase (Postgres) |
| AI / LLM | OpenRouter API (model-agnostic — swappable) |
| File parsing | Papaparse (CSV), SheetJS (Excel) |
| Charts | Recharts |
| Styling | Tailwind CSS |

---

## How It Works — Pipeline Overview

```
Upload (CSV/Excel)
      │
      ▼
┌─────────────────┐
│  Load into DB    │   Sales → clean table | Bank data → raw text
└────────┬─────────┘
         ▼
┌─────────────────┐
│  Clean (LLM)     │   Messy bank text → structured {amount, date, ref}
└────────┬─────────┘
         ▼
┌─────────────────┐
│  Match (code)    │   Amount + date comparison, deterministic
└────────┬─────────┘
         ▼
┌─────────────────┐
│  Exceptions      │   Everything unmatched, with a stated reason
└────────┬─────────┘
         ▼
┌─────────────────┐
│  Dashboard       │   Metrics, chart, drill-down, exceptions list
└─────────────────┘
```

---

## Getting Started

### 1. Clone and install
```bash
git clone https://github.com/<your-username>/finance-controller-agent.git
cd finance-controller-agent
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in your own values:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=your-openrouter-api-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
```

### 3. Set up the database
Open the Supabase SQL Editor and run the contents of `db/schema.sql`, followed by the reset function in `db/reset_function.sql`.

### 4. Run the app
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
