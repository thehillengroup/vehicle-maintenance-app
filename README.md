# FleetCare Monorepo

FleetCare is a shared React + React Native workspace for managing vehicle maintenance records, registration renewals, and emissions reminders. The Turborepo houses a Next.js web portal, an Expo-powered mobile app, and shared domain packages backed by Prisma + PostgreSQL (SQLite for local development).

> **Publishing reminder:** everything lives locally. When you're ready to push to GitHub, run:
``ash
 git remote add origin git@github.com:thehillengroup/<repo-name>.git
 git push -u origin master
`` 
> Replace <repo-name> with the repository you create on GitHub.

## Apps & Packages

- `apps/web` – Next.js App Router site with Tailwind UI, server components, and API routes for vehicles and reminders
- `apps/mobile` – Expo (React Native) client styled with NativeWind, consuming the same APIs and domain schemas
- `packages/core` – Zod-powered domain models, compliance calculators, and helper utilities shared by both clients
- `packages/db` – Prisma schema, generated client, and high-level data access helpers
- `packages/ui` – Reusable design system primitives (Button, Card, Badge) shared across surfaces
- `packages/eslint-config`, `packages/typescript-config` – shared tooling configuration

## Prerequisites

- Node.js 18+
- npm 10+
- SQLite (bundled with Prisma, no manual install required)

## Getting Started

```bash
# Install all workspace dependencies
npm install

# Generate the Prisma client
npx prisma generate --schema packages/db/prisma/schema.prisma

# Create the local SQLite database and run the initial migration
npx prisma migrate dev --schema packages/db/prisma/schema.prisma --name init

# (Optional) Seed the demo user + vehicles
npm run seed --workspace @repo/db

# Start the Next.js dashboard
turbo dev --filter=web

# Start the Expo app in a separate terminal
turbo dev --filter=mobile
```

Create a `.env` file at the repo root with:

```
DATABASE_URL="file:./packages/db/prisma/dev.db"
DEMO_USER_EMAIL="demo@example.com"
```

The Expo app reads `EXPO_PUBLIC_API_URL` (defaults to `http://localhost:3000`) to sync against the web APIs when both servers are running.

## Web Experience (`apps/web`)

- Garage overview dashboard summarising active vehicles, overdue tasks, and upcoming reminders
- Vehicle cards visualising compliance windows, mileage, and alert badges
- Reminder timeline fed by `GET /api/reminders?withinDays=90`
- Server actions & API routes backed by the shared Prisma helpers in `@repo/db`
- TailwindCSS theme shared with `@repo/ui` primitives

## Mobile Experience (`apps/mobile`)

- NativeWind-styled cards mirroring the web dashboard summary
- Hybrid online/offline data source: attempts to fetch from the local Next.js API and falls back to curated sample data when offline
- Shared Zod schemas (`@repo/core`) power runtime validation of remote payloads
- Metro configured for the monorepo so Expo can resolve shared packages without duplication

## Data Layer (`packages/db`)

- Prisma models for users, vehicles, maintenance events, reminders, and notification logs
- Derived compliance windows driven by `@repo/core` rule helpers
- Seed script that provisions a demo account with sample vehicles and reminders

## Domain Utilities (`packages/core`)

- Vehicle + reminder schemas with coercion helpers for ISO strings
- Compliance rule catalog per state plus a projection helper to compute due dates
- Shared enums and factories used by both clients and the API layer

## Helpful Commands

```bash
# Lint everything
turbo run lint

# Type-check everything
turbo run check-types

# Run Prisma studio against the SQLite DB
npx prisma studio --schema packages/db/prisma/schema.prisma
```

## Next Steps

1. Integrate real authentication (Clerk, Supabase, etc.) and flow the session into the data helper calls.
2. Expand state compliance rules beyond the bundled samples, ideally syncing from an external regulation data source.
3. Wire up background jobs (e.g., Vercel Cron or Supabase Edge Functions) to queue push/email/SMS reminders.
4. Add VIN decoding + document upload pipelines (S3/Supabase storage) to enrich vehicle records.
5. Harden the mobile app with offline persistence (SQLite/AsyncStorage) and push notification support via Expo services.

> **Reminder:** install Android Studio and the Android SDK before running expo run:android or launching the Android emulator.
