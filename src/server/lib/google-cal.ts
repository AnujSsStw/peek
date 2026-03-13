import { and, asc, eq, inArray, notInArray, sql } from "drizzle-orm";
import { google } from "googleapis";
import type { calendar_v3 } from "googleapis";

import { db } from "@/lib/db";
import { integrationSource } from "@/lib/db/schema";

const GOOGLE_PROVIDER_ID = "google";
const GOOGLE_SOURCE_KIND = "calendar";

export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
] as const;

type IntegrationSourceRow = typeof integrationSource.$inferSelect;

export type GoogleCalendarSource = {
  sourceId: string;
  calendarId: string;
  provider: "google";
  kind: "calendar";
  name: string;
  description: string | null;
  color: string | null;
  enabled: boolean;
  isAvailable: boolean;
  lastSyncedAt: Date | null;
  metadata: Record<string, unknown> | null;
};

export type GoogleCalendarEvent = {
  provider: "google";
  sourceId: string;
  calendarId: string;
  sourceName: string;
  eventId: string;
  title: string;
  description: string | null;
  location: string | null;
  htmlLink: string | null;
  status: string | null;
  isAllDay: boolean;
  startAt: string;
  endAt: string | null;
};

type GoogleCalendarRange = {
  from: Date;
  to: Date;
};

type ListGoogleCalendarsOptions = {
  enabledOnly?: boolean;
  includeUnavailable?: boolean;
  calendarIds?: string[];
};

type FetchGoogleCalendarEventsOptions = {
  userId: string;
  from: Date | string;
  to: Date | string;
  calendarIds?: string[];
  includeDisabled?: boolean;
};

function mapGoogleCalendarSource(
  source: IntegrationSourceRow,
): GoogleCalendarSource {
  return {
    sourceId: source.id,
    calendarId: source.externalId,
    provider: "google",
    kind: "calendar",
    name: source.name,
    description: source.description,
    color: source.color,
    enabled: source.enabled,
    isAvailable: source.isAvailable,
    lastSyncedAt: source.lastSyncedAt,
    metadata:
      (source.metadata as Record<string, unknown> | null | undefined) ?? null,
  };
}

function normalizeRange(
  from: Date | string,
  to: Date | string,
): GoogleCalendarRange {
  const normalizedFrom = from instanceof Date ? from : new Date(from);
  const normalizedTo = to instanceof Date ? to : new Date(to);

  if (
    Number.isNaN(normalizedFrom.getTime()) ||
    Number.isNaN(normalizedTo.getTime())
  ) {
    throw new Error("Invalid time range");
  }

  if (normalizedFrom >= normalizedTo) {
    throw new Error("The `from` date must be before `to`");
  }

  return {
    from: normalizedFrom,
    to: normalizedTo,
  };
}

function resolveGoogleBoundary(input?: {
  date?: string | null;
  dateTime?: string | null;
}) {
  if (!input) {
    return null;
  }

  if (input.dateTime) {
    return {
      iso: new Date(input.dateTime).toISOString(),
      isAllDay: false,
    };
  }

  if (input.date) {
    return {
      iso: new Date(`${input.date}T00:00:00.000Z`).toISOString(),
      isAllDay: true,
    };
  }

  return null;
}

async function getGoogleCalendarAccessToken(userId: string) {
  const { auth } = await import("@/lib/auth");
  const tokens = await auth.api.getAccessToken({
    body: {
      providerId: GOOGLE_PROVIDER_ID,
      userId,
    },
  });

  if (!tokens.accessToken) {
    throw new Error("Google access token is missing");
  }

  return tokens.accessToken;
}

async function getGoogleCalendarClient(userId: string) {
  const accessToken = await getGoogleCalendarAccessToken(userId);
  const oauthClient = new google.auth.OAuth2();
  oauthClient.setCredentials({
    access_token: accessToken,
  });

  return google.calendar({
    version: "v3",
    auth: oauthClient,
  });
}

async function markGoogleCalendarsUnavailable(userId: string) {
  await db
    .update(integrationSource)
    .set({
      isAvailable: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(integrationSource.userId, userId),
        eq(integrationSource.provider, GOOGLE_PROVIDER_ID),
        eq(integrationSource.kind, GOOGLE_SOURCE_KIND),
      ),
    );
}

export async function listGoogleCalendarLists(
  userId: string,
  options: ListGoogleCalendarsOptions = {},
) {
  const filters = [
    eq(integrationSource.userId, userId),
    eq(integrationSource.provider, GOOGLE_PROVIDER_ID),
    eq(integrationSource.kind, GOOGLE_SOURCE_KIND),
  ];

  if (options.enabledOnly) {
    filters.push(eq(integrationSource.enabled, true));
  }

  if (!options.includeUnavailable) {
    filters.push(eq(integrationSource.isAvailable, true));
  }

  if (options.calendarIds?.length) {
    filters.push(inArray(integrationSource.externalId, options.calendarIds));
  }

  const calendars = await db
    .select()
    .from(integrationSource)
    .where(and(...filters))
    .orderBy(asc(integrationSource.name));

  return calendars.map(mapGoogleCalendarSource);
}

export async function setGoogleCalendarEnabled(args: {
  userId: string;
  calendarId: string;
  enabled: boolean;
}) {
  const [updatedCalendar] = await db
    .update(integrationSource)
    .set({
      enabled: args.enabled,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(integrationSource.userId, args.userId),
        eq(integrationSource.provider, GOOGLE_PROVIDER_ID),
        eq(integrationSource.kind, GOOGLE_SOURCE_KIND),
        eq(integrationSource.externalId, args.calendarId),
      ),
    )
    .returning();

  return updatedCalendar ? mapGoogleCalendarSource(updatedCalendar) : null;
}

export async function syncGoogleCalendarLists(userId: string) {
  const syncedAt = new Date();
  const calendars: calendar_v3.Schema$CalendarListEntry[] = [];

  try {
    const calendarClient = await getGoogleCalendarClient(userId);

    let pageToken: string | undefined;
    do {
      const response = await calendarClient.calendarList.list({
        pageToken,
        showDeleted: false,
        showHidden: true,
      });

      calendars.push(...(response.data.items ?? []));
      pageToken = response.data.nextPageToken ?? undefined;
    } while (pageToken);
  } catch {
    await markGoogleCalendarsUnavailable(userId);
    return [];
  }

  if (!calendars.length) {
    await markGoogleCalendarsUnavailable(userId);
    return [];
  }

  const upsertRows = calendars
    .filter((calendar) => Boolean(calendar.id))
    .map((calendar) => ({
      id: crypto.randomUUID(),
      userId,
      provider: GOOGLE_PROVIDER_ID,
      kind: GOOGLE_SOURCE_KIND,
      externalId: calendar.id!,
      name: calendar.summary ?? "Untitled calendar",
      description: calendar.description ?? null,
      color: calendar.backgroundColor ?? calendar.foregroundColor ?? null,
      enabled: calendar.primary ?? calendar.selected ?? true,
      isAvailable: true,
      metadata: {
        accessRole: calendar.accessRole ?? null,
        primary: Boolean(calendar.primary),
        selected: Boolean(calendar.selected),
        timeZone: calendar.timeZone ?? null,
      },
      lastSyncedAt: syncedAt,
      createdAt: syncedAt,
      updatedAt: syncedAt,
    }));

  if (!upsertRows.length) {
    await markGoogleCalendarsUnavailable(userId);
    return [];
  }

  await db
    .insert(integrationSource)
    .values(upsertRows)
    .onConflictDoUpdate({
      target: [
        integrationSource.userId,
        integrationSource.provider,
        integrationSource.kind,
        integrationSource.externalId,
      ],
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        color: sql`excluded.color`,
        isAvailable: true,
        metadata: sql`excluded.metadata`,
        lastSyncedAt: syncedAt,
        updatedAt: syncedAt,
      },
    });

  const syncedCalendarIds = upsertRows.map((row) => row.externalId);

  const unavailableFilter = [
    eq(integrationSource.userId, userId),
    eq(integrationSource.provider, GOOGLE_PROVIDER_ID),
    eq(integrationSource.kind, GOOGLE_SOURCE_KIND),
  ];

  if (syncedCalendarIds.length) {
    unavailableFilter.push(
      notInArray(integrationSource.externalId, syncedCalendarIds),
    );
  }

  await db
    .update(integrationSource)
    .set({
      isAvailable: false,
      updatedAt: syncedAt,
    })
    .where(and(...unavailableFilter));

  return listGoogleCalendarLists(userId, {
    includeUnavailable: true,
  });
}

export async function fetchGoogleCalendarEvents(
  options: FetchGoogleCalendarEventsOptions,
) {
  const range = normalizeRange(options.from, options.to);
  const calendars = await listGoogleCalendarLists(options.userId, {
    enabledOnly: !options.includeDisabled,
    includeUnavailable: false,
    calendarIds: options.calendarIds,
  });

  if (!calendars.length) {
    return [];
  }

  const calendarClient = await getGoogleCalendarClient(options.userId);
  const eventsByCalendar = await Promise.all(
    calendars.map(async (calendar) => {
      const events: GoogleCalendarEvent[] = [];
      let pageToken: string | undefined;

      do {
        const response = await calendarClient.events.list({
          calendarId: calendar.calendarId,
          orderBy: "startTime",
          pageToken,
          showDeleted: false,
          singleEvents: true,
          timeMax: range.to.toISOString(),
          timeMin: range.from.toISOString(),
        });

        for (const event of response.data.items ?? []) {
          if (!event.id) {
            continue;
          }

          const start = resolveGoogleBoundary(event.start);
          if (!start) {
            continue;
          }

          const end = resolveGoogleBoundary(event.end);

          events.push({
            provider: "google",
            sourceId: calendar.sourceId,
            calendarId: calendar.calendarId,
            sourceName: calendar.name,
            eventId: event.id,
            title: event.summary ?? "Untitled event",
            description: event.description ?? null,
            location: event.location ?? null,
            htmlLink: event.htmlLink ?? null,
            status: event.status ?? null,
            isAllDay: start.isAllDay,
            startAt: start.iso,
            endAt: end?.iso ?? null,
          });
        }

        pageToken = response.data.nextPageToken ?? undefined;
      } while (pageToken);

      return events;
    }),
  );

  return eventsByCalendar
    .flat()
    .sort((left, right) => left.startAt.localeCompare(right.startAt));
}
