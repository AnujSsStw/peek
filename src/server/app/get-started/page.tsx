"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

// ── Layout definitions (mirrors mobile WidgetConfigurationScreen) ──────
const LAYOUT_GROUPS = [
  {
    size: "Small (2×2)",
    layouts: [
      {
        id: "contextual-hero",
        label: "Contextual Hero",
        desc: "Single glanceable value — time, weather, or next event",
        preview: { icon: "☀️", val: "72°", sub: "Clear skies" },
      },
      {
        id: "progress-ring",
        label: "Progress Ring",
        desc: "Circular progress of your day's completion",
        preview: { icon: "◐", val: "68%", sub: "Day complete" },
      },
      {
        id: "streak-flame",
        label: "Streak Flame",
        desc: "Track your daily streak with a bold counter",
        preview: { icon: "🔥", val: "12", sub: "Day streak" },
      },
    ],
  },
  {
    size: "Medium (2×4)",
    layouts: [
      {
        id: "bento-box",
        label: "Bento Box",
        desc: "Four info cells in a compact grid layout",
        preview: { cells: ["📅 Next Up", "⏱ Focus", "🔥 Streak", "✅ Tasks"] },
      },
      {
        id: "minimalist-stack",
        label: "Minimalist Stack",
        desc: "Three lines of context — day, message, detail",
        preview: {
          lines: [
            "Wednesday · Focus Day",
            "3 tasks left to crush",
            "Next: Design review at 2pm",
          ],
        },
      },
      {
        id: "companion-quote",
        label: "Companion Quote",
        desc: "A gentle motivational nudge for your day",
        preview: {
          quote: "Small steps still move you forward.",
          from: "Peek · Your afternoon nudge",
        },
      },
      {
        id: "daily-score",
        label: "Daily Score",
        desc: "Score bars for tasks, focus, and movement",
        preview: { score: 74, bars: ["Tasks 80%", "Focus 65%", "Move 78%"] },
      },
    ],
  },
  {
    size: "Large (4×4)",
    layouts: [
      {
        id: "timeline",
        label: "Timeline",
        desc: "Chronological view of your day's events",
        preview: {
          events: [
            "09:00 Morning journal",
            "10:30 Standup",
            "13:00 Deep work",
            "15:00 Review",
          ],
        },
      },
      {
        id: "timeline-tasks",
        label: "Timeline + Tasks",
        desc: "Events and tasks woven into a single timeline",
        preview: {
          events: [
            "09:00 Journal ✓",
            "10:30 Standup ✓",
            "→ Ship notif flow",
            "15:00 Study",
          ],
        },
      },
    ],
  },
];

type LayoutDef = {
  id: string;
  label: string;
  desc: string;
  preview: Record<string, unknown>;
};

const ALL_LAYOUTS: LayoutDef[] = LAYOUT_GROUPS.flatMap(
  (g) => g.layouts as LayoutDef[],
);

// ── Integrations config ────────────────────────────────────────────────
const INTEGRATIONS = [
  {
    id: "google",
    name: "Google Calendar",
    desc: "Events from Gmail & Google Workspace",
    icon: "📅",
    color: "#4285F4",
  },
  {
    id: "todoist",
    name: "Todoist",
    desc: "Tasks, projects, and due dates",
    icon: "✅",
    color: "#E44332",
  },
];

// ── localStorage helpers ───────────────────────────────────────────────
const STORAGE_KEY = "peek_web_widgets";

type SavedWidget = { id: string; layoutId: string; addedAt: number };

function getSavedWidgets(): SavedWidget[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveWidget(layoutId: string) {
  const widgets = getSavedWidgets();
  widgets.push({ id: crypto.randomUUID(), layoutId, addedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

function removeWidget(id: string) {
  const widgets = getSavedWidgets().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

// ── Main component ─────────────────────────────────────────────────────
type Step = "login" | "connect" | "widgets";

export default function GetStartedPage() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("login");
  const [savedWidgets, setSavedWidgets] = useState<SavedWidget[]>([]);
  const [pickingLayout, setPickingLayout] = useState(false);

  const { data: integrations, refetch: refetchIntegrations } = useQuery(
    trpc.integrations.list.queryOptions(),
  );

  const connectedProviders = new Set<string>(
    integrations?.filter((i) => i.connected).map((i) => i.id) ?? [],
  );

  const { data: user, isPending } = authClient.useSession();

  // Check session on mount
  useEffect(() => {
    const nav = searchParams.get("nav");
    if (user?.session && !isPending && nav !== "widgets") {
      setStep("connect");
    }

    setSavedWidgets(getSavedWidgets());
  }, [user, isPending]);

  useEffect(() => {
    const nav = searchParams.get("nav");
    if (nav === "integrations") {
      setStep("connect");
    } else if (nav === "widgets") {
      setStep("widgets");
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/get-started",
      });
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  };

  const handleConnect = async (providerId: string) => {
    if (connectedProviders.has(providerId)) return;
    try {
      const scopes = [];
      if (providerId === "google") {
        scopes.push(
          "https://www.googleapis.com/auth/calendar.readonly",
          "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
        );
      } else if (providerId === "todoist") {
        scopes.push("data:read");
      }
      await authClient.linkSocial({
        provider: providerId,
        callbackURL: "/get-started?nav=integrations",
        scopes,
      });
    } catch (err) {
      console.error(`${providerId} connect error:`, err);
    }
  };

  const disconnectMutation = useMutation(
    trpc.integrations.disconnect.mutationOptions({
      onSuccess: () => refetchIntegrations(),
    }),
  );

  const handleDisconnect = (providerId: string) => {
    disconnectMutation.mutate({ provider: providerId });
  };

  const handleAddWidget = (layoutId: string) => {
    saveWidget(layoutId);
    setSavedWidgets(getSavedWidgets());
    setPickingLayout(false);
  };

  const handleRemoveWidget = (id: string) => {
    removeWidget(id);
    setSavedWidgets(getSavedWidgets());
  };

  // ── Step indicator ─────────────────────────────
  const steps: { key: Step; label: string; num: string }[] = [
    { key: "login", label: "Sign In", num: "01" },
    { key: "connect", label: "Connect", num: "02" },
    { key: "widgets", label: "Widgets", num: "03" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 40px",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--text)",
          }}
        >
          <div className="glow-dot" />
          <span
            style={{
              fontFamily: "var(--display)",
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            Peek
          </span>
        </Link>

        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            {user.user.image && (
              <img
                src={user.user.image}
                alt=""
                style={{ width: 24, height: 24, borderRadius: 6 }}
              />
            )}
            {user.user.name}
          </div>
        )}
      </nav>

      {/* Step indicators */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "760px",
          margin: "0 auto",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "48px",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.key}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  height: "2px",
                  borderRadius: "1px",
                  background:
                    i <= stepIndex ? "var(--accent)" : "var(--border-up)",
                  transition: "background 0.4s ease",
                }}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    color:
                      i <= stepIndex ? "var(--accent)" : "var(--text-muted)",
                    transition: "color 0.3s",
                  }}
                >
                  {s.num}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: i <= stepIndex ? "var(--text)" : "var(--text-muted)",
                    transition: "color 0.3s",
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "760px",
          margin: "0 auto",
          padding: "0 40px 80px",
        }}
      >
        {/* ── Step 1: Login ────────────────────────── */}
        {step === "login" && (
          <div className="animate-fade-up">
            <h1
              style={{
                fontFamily: "var(--display)",
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "12px",
              }}
            >
              Sign in to get started
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: "36px",
                maxWidth: "400px",
              }}
            >
              Connect your Google account to sync calendars and personalize your
              widgets.
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={isPending}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                width: "100%",
                maxWidth: "380px",
                padding: "16px 24px",
                background: "var(--bg-up)",
                border: "1px solid var(--border-up)",
                borderRadius: "14px",
                color: "var(--text)",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "var(--sans)",
                cursor: isPending ? "wait" : "pointer",
                opacity: isPending ? 0.6 : 1,
                transition: "border-color 0.2s, opacity 0.2s",
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "11px",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#4285F4",
                  flexShrink: 0,
                }}
              >
                G
              </span>
              {isPending ? "Redirecting..." : "Continue with Google"}
            </button>

            <p
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginTop: "16px",
                lineHeight: 1.6,
                maxWidth: "380px",
              }}
            >
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        )}

        {/* ── Step 2: Connect Integrations ──────────── */}
        {step === "connect" && (
          <div className="animate-fade-up">
            <h1
              style={{
                fontFamily: "var(--display)",
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "12px",
              }}
            >
              Connect your sources
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: "32px",
                maxWidth: "440px",
              }}
            >
              We pull events and tasks in. You see them on your widget. That's
              it.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "32px",
              }}
            >
              {INTEGRATIONS.map((integration) => {
                const connected = connectedProviders.has(integration.id);
                const isDisconnecting =
                  disconnectMutation.isPending &&
                  disconnectMutation.variables?.provider === integration.id;

                return (
                  <div
                    key={integration.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 20px",
                      background: "var(--bg-up)",
                      border: `1px solid ${connected ? "rgba(74,222,128,0.2)" : "var(--border-up)"}`,
                      borderRadius: "14px",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: `${integration.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        flexShrink: 0,
                      }}
                    >
                      {integration.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: 600 }}>
                        {integration.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {integration.desc}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {connected ? (
                        <>
                          <span
                            style={{
                              padding: "8px 12px",
                              borderRadius: "8px",
                              background: "rgba(74,222,128,0.1)",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "rgb(74,222,128)",
                            }}
                          >
                            ✓ Connected
                          </span>
                          <button
                            onClick={() => handleDisconnect(integration.id)}
                            disabled={isDisconnecting}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "8px",
                              border: "1px solid rgba(232,64,64,0.15)",
                              background: "rgba(232,64,64,0.08)",
                              fontSize: "12px",
                              fontWeight: 600,
                              fontFamily: "var(--sans)",
                              color: "#e84040",
                              cursor: isDisconnecting ? "wait" : "pointer",
                              opacity: isDisconnecting ? 0.6 : 1,
                              transition: "opacity 0.2s",
                            }}
                          >
                            {isDisconnecting ? "..." : "Disconnect"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(integration.id)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: 600,
                            fontFamily: "var(--sans)",
                            cursor: "pointer",
                            background: "var(--text)",
                            color: "var(--bg)",
                            transition: "opacity 0.2s",
                          }}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("widgets")}
                style={{
                  padding: "14px 32px",
                  background: "var(--accent)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                }}
              >
                Continue
              </button>
              <button
                onClick={() => setStep("widgets")}
                style={{
                  padding: "14px 20px",
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                }}
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Widgets ──────────────────────── */}
        {step === "widgets" && (
          <div className="animate-fade-up">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "32px",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: "36px",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    marginBottom: "12px",
                  }}
                >
                  Your widgets
                </h1>
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    maxWidth: "400px",
                  }}
                >
                  Pick layouts to save. On Android, add the Peek widget to your
                  home screen and choose from these.
                </p>
              </div>
              <button
                onClick={() => setPickingLayout(true)}
                style={{
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginTop: "4px",
                }}
              >
                + Add Widget
              </button>
            </div>

            {/* Saved widgets list */}
            {savedWidgets.length === 0 && !pickingLayout && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "var(--bg-up)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>📱</div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "6px",
                  }}
                >
                  No widgets yet
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    marginBottom: "20px",
                  }}
                >
                  Add a widget layout to get started
                </div>
                <button
                  onClick={() => setPickingLayout(true)}
                  style={{
                    padding: "10px 24px",
                    background: "var(--accent)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "var(--sans)",
                    cursor: "pointer",
                  }}
                >
                  + Add Widget
                </button>
              </div>
            )}

            {savedWidgets.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "24px",
                }}
              >
                {savedWidgets.map((w) => {
                  const layout = ALL_LAYOUTS.find(
                    (l: LayoutDef) => l.id === w.layoutId,
                  );
                  if (!layout) return null;
                  const previewIcon =
                    layout.preview && typeof layout.preview.icon === "string"
                      ? layout.preview.icon
                      : "📊";
                  return (
                    <div
                      key={w.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px 20px",
                        background: "var(--bg-up)",
                        border: "1px solid var(--border-up)",
                        borderRadius: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "10px",
                          background: "var(--surface)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          flexShrink: 0,
                        }}
                      >
                        {previewIcon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", fontWeight: 600 }}>
                          {layout.label}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            marginTop: "2px",
                          }}
                        >
                          {layout.desc}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            background: "rgba(74,222,128,0.1)",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "rgb(74,222,128)",
                          }}
                        >
                          Saved
                        </div>
                        <button
                          onClick={() => handleRemoveWidget(w.id)}
                          style={{
                            padding: "6px 10px",
                            background: "rgba(232,64,64,0.08)",
                            border: "1px solid rgba(232,64,64,0.15)",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#e84040",
                            cursor: "pointer",
                            fontFamily: "var(--sans)",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}

                <Link
                  href="/"
                  className="items-center gap-1.5 px-5 py-2.5 mt-10 bg-(--accent) text-(--bg) rounded-[10px] text-[13px] font-bold no-underline font-[var(--sans)]"
                >
                  Go to Dashboard →
                </Link>
              </div>
            )}

            {/* Layout picker */}
            {pickingLayout && (
              <div
                className="animate-fade-up"
                style={{
                  background: "var(--bg-up)",
                  border: "1px solid var(--border-up)",
                  borderRadius: "16px",
                  padding: "24px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--display)",
                      fontSize: "20px",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Choose a layout
                  </h2>
                  <button
                    onClick={() => setPickingLayout(false)}
                    style={{
                      padding: "6px 12px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      fontFamily: "var(--sans)",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>

                {LAYOUT_GROUPS.map((group) => (
                  <div key={group.size} style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "1px",
                          background: "var(--accent)",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "10px",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {group.size}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      {group.layouts.map((layout) => (
                        <button
                          key={layout.id}
                          onClick={() => handleAddWidget(layout.id)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left",
                            padding: "16px",
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "border-color 0.2s, background 0.2s",
                            fontFamily: "var(--sans)",
                            color: "var(--text)",
                          }}
                        >
                          {/* Mini preview */}
                          <div
                            style={{
                              width: "100%",
                              height: "64px",
                              background: "var(--bg)",
                              borderRadius: "8px",
                              marginBottom: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              padding: "8px",
                            }}
                          >
                            <LayoutMiniPreview preview={layout.preview} />
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              marginBottom: "4px",
                            }}
                          >
                            {layout.label}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                              lineHeight: 1.5,
                            }}
                          >
                            {layout.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Mini preview renderers ─────────────────────────────────────────────
function LayoutMiniPreview({ preview }: { preview: Record<string, unknown> }) {
  if ("icon" in preview && "val" in preview) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "16px", lineHeight: 1 }}>
          {preview.icon as string}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 800,
            lineHeight: 1,
            marginTop: "2px",
          }}
        >
          {preview.val as string}
        </div>
        {"sub" in preview && (
          <div
            style={{
              fontSize: "8px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            {preview.sub as string}
          </div>
        )}
      </div>
    );
  }

  if ("cells" in preview) {
    const cells = preview.cells as string[];
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3px",
          width: "100%",
          height: "100%",
        }}
      >
        {cells.map((c) => (
          <div
            key={c}
            style={{
              background: "var(--surface)",
              borderRadius: "4px",
              fontSize: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px",
              color: "var(--text-muted)",
            }}
          >
            {c}
          </div>
        ))}
      </div>
    );
  }

  if ("lines" in preview) {
    const lines = preview.lines as string[];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4px",
          width: "100%",
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: i === 0 ? "7px" : "8px",
              fontWeight: i === 1 ? 700 : 400,
              color: i === 0 ? "var(--text-muted)" : "var(--text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {l}
          </div>
        ))}
      </div>
    );
  }

  if ("quote" in preview) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "8px",
            fontStyle: "italic",
            lineHeight: 1.4,
            color: "var(--text)",
          }}
        >
          "{preview.quote as string}"
        </div>
        <div
          style={{
            fontSize: "6px",
            color: "var(--text-muted)",
            marginTop: "4px",
          }}
        >
          — {preview.from as string}
        </div>
      </div>
    );
  }

  if ("score" in preview) {
    const bars = preview.bars as string[];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "100%",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 800, textAlign: "center" }}>
          {preview.score as number}
        </div>
        {bars.map((b) => (
          <div key={b} style={{ fontSize: "7px", color: "var(--text-muted)" }}>
            {b}
          </div>
        ))}
      </div>
    );
  }

  if ("events" in preview) {
    const events = preview.events as string[];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          width: "100%",
        }}
      >
        {events.map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "7px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: i === 2 ? "var(--accent)" : "var(--text-muted)",
                opacity: i === 2 ? 1 : 0.4,
                flexShrink: 0,
              }}
            />
            <span
              style={{ color: i === 2 ? "var(--text)" : "var(--text-muted)" }}
            >
              {e}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
