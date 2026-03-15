# Peek

AI-powered personalized home screen widgets that synthesize your calendar, tasks, and weather into beautiful, contextually-aware glanceable cards.

## Overview

Peek connects to your Google Calendar, Todoist, and local weather to generate smart widgets using AI. Each widget is tailored to your schedule, time of day, and current conditions — rendered as images and delivered to your home screen.

## Tech Stack

**Mobile App** — React Native + Expo (iOS & Android)
- Expo Router (file-based navigation)
- tRPC + React Query (type-safe data fetching)
- Better Auth (authentication)
- react-native-android-widget (Android home screen widgets)

**Backend** — Next.js + Node.js/Bun
- tRPC (API layer)
- Drizzle ORM + PostgreSQL (Neon serverless)
- OpenAI gpt-5-mini (AI content generation)
- Puppeteer (HTML → image rendering)
- UploadThing (image CDN)
- Better Auth with Google & Todoist OAuth

## Widget Layouts

9 layouts across 3 sizes:

| Size | Layouts |
|------|---------|
| Small (2x2) | Contextual Hero, Progress Ring, Streak Flame |
| Medium (4x2) | Bento Box, Minimalist Stack, Companion Quote, Daily Score |
| Large (4x4) | Timeline, Timeline + Tasks |

Each layout supports multiple style variants (morning, night, urgent, calm, weather, eink, frost, dark, etc.).

## How It Works

```
Google Calendar + Todoist + Weather API
        ↓
AI analyzes context (time, schedule, mood)
        ↓
Generates widget data per layout
        ↓
HTML templates rendered with AI data
        ↓
Puppeteer screenshots → PNG images
        ↓
UploadThing CDN → Mobile home screen widget
```

Widgets auto-refresh every 30 minutes.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or npm/yarn)
- PostgreSQL database (e.g. [Neon](https://neon.tech/))
- API keys: OpenAI, Weather API, Google OAuth, Todoist OAuth, UploadThing

### Backend

```bash
cd src/server
bun install
# Configure .env (see Environment Variables below)
bun run drizzle-kit push   # Apply database migrations
bun run dev                # http://localhost:3000
```

### Mobile App

```bash
cd src/app
bun install
bun run start       # Expo dev server
bun run android     # Run on Android
bun run ios         # Run on iOS
```

### Environment Variables

Create `src/server/.env`:

```env
# AI
AI_GATEWAY_API_KEY=          # OpenAI API key

# Database
DATABASE_URL=                # PostgreSQL connection string

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# OAuth - Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth - Todoist
TODOIST_CLIENT_ID=
TODOIST_CLIENT_SECRET=

# Weather
WEATHER_API_KEY=

# File Storage
UPLOADTHING_TOKEN=
```

## Project Structure

```
src/
├── app/                    # React Native / Expo mobile app
│   ├── src/app/            # Screens (tabs, onboarding, widget config)
│   ├── src/widget/         # Android widget components
│   ├── src/components/     # Shared UI components
│   └── widgets/            # Android widget definitions
│
└── server/                 # Next.js backend + web dashboard
    ├── app/api/
    │   ├── generate/       # AI content generation pipeline
    │   ├── screenshot/     # HTML → image rendering (9 templates)
    │   ├── auth/           # Better Auth routes
    │   └── trpc/           # tRPC endpoint
    ├── lib/
    │   ├── db/             # Drizzle schema & client
    │   ├── google-cal.ts   # Google Calendar integration
    │   ├── todoist-task.ts # Todoist integration
    │   └── trpc/           # tRPC routers (integrations, widgets, generate)
    └── drizzle/            # Database migrations
```
