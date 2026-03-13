import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { account, integrationSource } from "@/lib/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const SUPPORTED_PROVIDERS = [
  {
    id: "google",
    name: "Google Calendar",
    icon: "📅",
    iconBg: "rgba(66,133,244,0.1)",
    kind: "calendar",
    section: "Calendars",
  },
  {
    id: "todoist",
    name: "Todoist",
    icon: "✅",
    iconBg: "rgba(228,66,52,0.08)",
    kind: "project",
    section: "Tasks",
  },
] as const;

export const integrationsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [accounts, sources] = await Promise.all([
      db
        .select({
          id: account.id,
          providerId: account.providerId,
          accountId: account.accountId,
        })
        .from(account)
        .where(eq(account.userId, userId)),
      db
        .select()
        .from(integrationSource)
        .where(eq(integrationSource.userId, userId)),
    ]);

    // Find which provider the user originally signed up with (credential/first account)
    // The user table email matches the login provider
    const loginEmail = ctx.session.user.email;

    return SUPPORTED_PROVIDERS.map((provider) => {
      const connectedAccount = accounts.find(
        (a) => a.providerId === provider.id,
      );
      const providerSources = sources.filter(
        (s) => s.provider === provider.id && s.kind === provider.kind,
      );

      return {
        id: provider.id,
        name: provider.name,
        icon: provider.icon,
        iconBg: provider.iconBg,
        section: provider.section,
        connected: !!connectedAccount,
        accountId: connectedAccount?.accountId ?? null,
        isLoginAccount: connectedAccount?.accountId === loginEmail,
        sources: providerSources.map((s) => ({
          id: s.id,
          externalId: s.externalId,
          name: s.name,
          description: s.description,
          color: s.color,
          enabled: s.enabled,
          isAvailable: s.isAvailable,
          kind: s.kind,
        })),
      };
    });
  }),

  detail: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const provider = SUPPORTED_PROVIDERS.find((p) => p.id === input.provider);
      if (!provider) {
        return null;
      }

      const [accounts, sources] = await Promise.all([
        db
          .select({
            id: account.id,
            providerId: account.providerId,
            accountId: account.accountId,
          })
          .from(account)
          .where(
            and(
              eq(account.userId, userId),
              eq(account.providerId, input.provider),
            ),
          ),
        db
          .select()
          .from(integrationSource)
          .where(
            and(
              eq(integrationSource.userId, userId),
              eq(integrationSource.provider, input.provider),
            ),
          ),
      ]);

      const connectedAccount = accounts[0] ?? null;
      const loginEmail = ctx.session.user.email;

      return {
        id: provider.id,
        name: provider.name,
        icon: provider.icon,
        iconBg: provider.iconBg,
        section: provider.section,
        connected: !!connectedAccount,
        accountId: connectedAccount?.accountId ?? null,
        isLoginAccount: connectedAccount?.accountId === loginEmail,
        sources: sources.map((s) => ({
          id: s.id,
          externalId: s.externalId,
          name: s.name,
          description: s.description,
          color: s.color,
          enabled: s.enabled,
          isAvailable: s.isAvailable,
          kind: s.kind,
          lastSyncedAt: s.lastSyncedAt,
        })),
      };
    }),

  toggleSource: protectedProcedure
    .input(z.object({ sourceId: z.string(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [updated] = await db
        .update(integrationSource)
        .set({ enabled: input.enabled, updatedAt: new Date() })
        .where(
          and(
            eq(integrationSource.id, input.sourceId),
            eq(integrationSource.userId, userId),
          ),
        )
        .returning({
          id: integrationSource.id,
          enabled: integrationSource.enabled,
        });

      return updated ?? null;
    }),

  disconnect: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const loginEmail = ctx.session.user.email;

      // Find the connected account for this provider
      const [connectedAccount] = await db
        .select({
          id: account.id,
          accountId: account.accountId,
          providerId: account.providerId,
        })
        .from(account)
        .where(
          and(
            eq(account.userId, userId),
            eq(account.providerId, input.provider),
          ),
        );

      if (!connectedAccount) {
        return { success: true };
      }

      // Always remove integration sources
      await db
        .delete(integrationSource)
        .where(
          and(
            eq(integrationSource.userId, userId),
            eq(integrationSource.provider, input.provider),
          ),
        );

      // Only remove the account if it's NOT the same as the login account
      const isSameAsLogin = connectedAccount.accountId === loginEmail;

      if (!isSameAsLogin) {
        await db
          .delete(account)
          .where(
            and(
              eq(account.userId, userId),
              eq(account.providerId, input.provider),
            ),
          );
      }

      return { success: true, accountKept: isSameAsLogin };
    }),
});
