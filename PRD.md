# Peek - Product Requirements Document

## Overview

**Peek** is a cross-platform mobile application that delivers AI-powered, personalized home screen widgets. It pulls data from Google Calendar, Todoist, and weather APIs, then uses AI to generate beautiful, context-aware widget visuals that give users a quick glance at their day.

## Problem Statement

Users juggle multiple productivity tools (calendars, task managers) and frequently check their phones for quick updates. Existing widgets are static, single-purpose, and visually bland. There's no unified, intelligent widget that synthesizes a user's day into a single, beautiful, at-a-glance view.

## Target Users

- Productivity-focused mobile users who rely on calendars and task managers
- Users who value home screen customization and aesthetics
- People who want a quick daily overview without opening multiple apps

## Core Features

### 1. AI-Generated Personalized Widgets

The central feature. An AI model (OpenAI) analyzes the user's upcoming events, tasks, weather, time of day, and location to generate contextually relevant widget content and styling.

- **Contextual awareness**: Widget tone and style adapt to the user's schedule (e.g., "urgent" if a meeting is imminent, "calm" on a free afternoon)
- **Dynamic content**: Headlines, summaries, progress indicators, and quotes are generated based on real data
- **Batch generation**: Multiple widget layouts generated efficiently in a single AI call

### 2. Widget Layouts

Nine widget designs across three size categories:

| Size         | Layout           | Description                             |
| ------------ | ---------------- | --------------------------------------- |
| Small (2x2)  | Contextual Hero  | Bold single-focus card                  |
| Small (2x2)  | Progress Ring    | Circular progress indicator for the day |
| Small (2x2)  | Streak Flame     | Motivational streak counter             |
| Medium (4x2) | Bento Box        | Multi-section grid layout               |
| Medium (4x2) | Minimalist Stack | Clean, stacked information              |
| Medium (4x2) | Companion Quote  | AI-generated contextual quote           |
| Medium (4x2) | Daily Score      | Numerical day summary                   |
| Large (4x4)  | Timeline         | Visual timeline of the day              |
| Large (4x4)  | Timeline + Tasks | Combined timeline and task list         |

Each layout supports multiple style variants (e.g., eink, gradient, glassmorphic) selected by the AI based on context.

### 3. Integrations

#### Google Calendar
- OAuth-based connection
- Fetches upcoming events across multiple calendars
- Users can toggle individual calendars on/off as data sources

#### Todoist
- OAuth-based connection
- Pulls tasks and projects
- Users can toggle individual projects on/off

#### Weather
- Automatic weather data based on user location
- Feeds into AI context for widget generation

### 4. Widget Management

- Browse and select widget layouts from a gallery
- Preview widgets before adding to home screen
- Configure which integrations feed into each widget
- Widgets auto-refresh every 30 minutes
- Resize handling with appropriate layout adaptation

### 5. Authentication

- Google OAuth sign-in (primary)
- Session-based auth with secure token storage
- Connect additional OAuth providers (Todoist) for data without changing login

## Technical Architecture

### Platforms
- **Mobile**: React Native + Expo (iOS and Android)
- **Web**: Next.js dashboard for management and preview
- **Android widgets**: Native home screen widgets via `react-native-android-widget`

### Backend
- **API**: Next.js API routes + tRPC for type-safe RPC
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
- **Auth**: Better Auth with Google and Todoist OAuth providers
- **AI**: OpenAI API for widget content generation
- **Rendering**: Puppeteer converts HTML widget templates to images
- **Storage**: UploadThing for generated widget images

### Data Flow

```
User's integrations (Calendar, Todoist)
        |
        v
  Backend fetches raw data
        |
        v
  AI generates contextual widget content per layout
        |
        v
  HTML templates rendered with generated data
        |
        v
  Puppeteer screenshots HTML -> widget images
        |
        v
  Images served to mobile app -> displayed as home screen widgets
```

### Key API Endpoints

| Endpoint                    | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `generate.batchHtml`        | Generate widget HTML for multiple layouts     |
| `integrations.list`         | List connected integrations                   |
| `integrations.toggleSource` | Enable/disable specific calendars/projects    |
| `api/screenshot`            | Render widget HTML to image                   |
| `api/generate`              | Full generation pipeline (data + AI + render) |

### Database Schema

- **user** - User accounts
- **session** - Active sessions
- **account** - OAuth connections (Google, Todoist)
- **integration_source** - Connected calendars/projects with enable/disable toggles

## Non-Functional Requirements

### Performance
- Widget images cached for 5 minutes to reduce API calls
- Batch AI calls to minimize OpenAI API usage
- Widget resize events throttled to prevent excessive regeneration
- 30-minute background refresh cycle

### Security
- OAuth tokens stored in device SecureStore
- Session-based authentication
- No sensitive data stored in widget images

### Timezone Handling
- All event times converted to user's local timezone for accurate display

## Current Status

The project is in active development with core functionality complete:
- Google Calendar and Todoist integrations working
- All 9 widget layouts implemented
- Android widget support nearly complete
- Web dashboard functional
- AI generation pipeline operational

## Future Considerations

- iOS widget support (WidgetKit)
- Additional integrations (Notion, Linear, GitHub, etc.)
- User-customizable color themes and fonts
- Shared/social widgets
- Offline mode with cached data
- Widget interaction (tap to open relevant app/event)
