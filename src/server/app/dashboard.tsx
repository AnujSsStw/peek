"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// ── Layout metadata ────────────────────────────────────────────────────
const LAYOUT_META: Record<
  string,
  { label: string; size: string; w: number; h: number }
> = {
  "contextual-hero": {
    label: "Contextual Hero",
    size: "Small",
    w: 170,
    h: 170,
  },
  "progress-ring": { label: "Progress Ring", size: "Small", w: 170, h: 170 },
  "streak-flame": { label: "Streak Flame", size: "Small", w: 170, h: 170 },
  "bento-box": { label: "Bento Box", size: "Medium", w: 360, h: 180 },
  "minimalist-stack": {
    label: "Minimalist Stack",
    size: "Medium",
    w: 360,
    h: 170,
  },
  "companion-quote": {
    label: "Companion Quote",
    size: "Medium",
    w: 360,
    h: 170,
  },
  "daily-score": { label: "Daily Score", size: "Medium", w: 360, h: 170 },
  timeline: { label: "Timeline", size: "Large", w: 340, h: 360 },
  "timeline-tasks": {
    label: "Timeline + Tasks",
    size: "Large",
    w: 340,
    h: 360,
  },
};

// ── localStorage helpers ───────────────────────────────────────────────
const STORAGE_KEY = "peek_web_widgets";
const CACHE_KEY = "peek_html_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

type SavedWidget = { id: string; layoutId: string; addedAt: number };
type HtmlCache = { timestamp: number; entries: Record<string, string> };

function getSavedWidgets(): SavedWidget[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function removeWidget(id: string) {
  const widgets = getSavedWidgets().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

function getCachedHtml(): HtmlCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: HtmlCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cache;
  } catch {
    return null;
  }
}

function setCachedHtml(entries: Record<string, string>) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), entries }),
  );
}

function clearCachedHtml() {
  localStorage.removeItem(CACHE_KEY);
}

// ── Dashboard component ────────────────────────────────────────────────
export function Dashboard({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const [savedWidgets, setSavedWidgets] = useState<SavedWidget[]>([]);
  const [htmlBlobs, setHtmlBlobs] = useState<Record<string, string>>({});
  const [loadingWidgets, setLoadingWidgets] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: integrations } = useQuery(
    trpc.integrations.list.queryOptions(),
  );
  const connectedCount = integrations?.filter((i) => i.connected).length ?? 0;

  useEffect(() => {
    setSavedWidgets(getSavedWidgets());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/welcome");
  };

  const batchMutation = useMutation(trpc.generate.batchHtml.mutationOptions());

  const htmlToBlobUrl = useCallback((html: string) => {
    return URL.createObjectURL(new Blob([html], { type: "text/html" }));
  }, []);

  const fetchAllWidgets = useCallback(
    async (widgets: SavedWidget[], skipCache = false) => {
      if (widgets.length === 0) return;

      // Check cache first (unless skipping)
      if (!skipCache) {
        const cache = getCachedHtml();
        if (cache) {
          const allCached = widgets.every((w) => cache.entries[w.layoutId]);
          if (allCached) {
            const blobs: Record<string, string> = {};
            for (const w of widgets) {
              blobs[w.id] = htmlToBlobUrl(cache.entries[w.layoutId]);
            }
            setHtmlBlobs(blobs);
            return;
          }
        }
      }

      const allIds = widgets.map((w) => w.id);
      setLoadingWidgets(new Set(allIds));

      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const layouts = [...new Set(widgets.map((w) => w.layoutId))];

        const results = await batchMutation.mutateAsync({
          layouts,
          date: now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: timezone,
          }),
          currentTime: now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
            timeZone: timezone,
          }),
          timezone,
        });

        // Cache the raw HTML by layout
        setCachedHtml(results);

        // Create blob URLs per widget
        const blobs: Record<string, string> = {};
        for (const w of widgets) {
          if (results[w.layoutId]) {
            blobs[w.id] = htmlToBlobUrl(results[w.layoutId]);
          }
        }
        setHtmlBlobs((prev) => ({ ...prev, ...blobs }));
      } catch (err) {
        console.error("Failed to generate widgets:", err);
      } finally {
        setLoadingWidgets(new Set());
      }
    },
    [batchMutation, htmlToBlobUrl],
  );

  // Fetch HTML for all saved widgets on mount
  useEffect(() => {
    if (savedWidgets.length > 0) {
      fetchAllWidgets(savedWidgets);
    }
  }, [savedWidgets]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      for (const url of Object.values(htmlBlobs)) {
        URL.revokeObjectURL(url);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefreshAll = async () => {
    setRefreshing(true);
    for (const url of Object.values(htmlBlobs)) {
      URL.revokeObjectURL(url);
    }
    setHtmlBlobs({});
    clearCachedHtml();
    await fetchAllWidgets(savedWidgets, true);
    setRefreshing(false);
  };

  const handleRemove = (id: string) => {
    if (htmlBlobs[id]) URL.revokeObjectURL(htmlBlobs[id]);
    removeWidget(id);
    setSavedWidgets(getSavedWidgets());
    setHtmlBlobs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute -top-[10%] -right-[5%] w-125 h-125 rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(196,242,74,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="animate-fade-in relative z-20 flex items-center justify-between px-10 py-6 max-w-[1100px] mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="glow-dot" />
          <span className="font-[var(--display)] font-extrabold text-xl tracking-tight">
            Peek
          </span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/welcome"
            className="text-[13px] text-[var(--text-muted)] no-underline hover:text-[var(--text)]"
          >
            About
          </Link>
          <Link
            href="/help"
            className="text-[13px] text-[var(--text-muted)] no-underline hover:text-[var(--text)]"
          >
            Help
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 py-1.5 pl-2 pr-3 bg-[var(--bg-up)] border border-[var(--border)] rounded-[10px] cursor-pointer hover:border-[var(--border-up)] transition-colors"
            >
              {user.image && (
                <img
                  src={user.image}
                  alt=""
                  className="w-[22px] h-[22px] rounded-md"
                />
              )}
              <span className="text-[13px] font-medium">{user.name}</span>
              <svg
                className={`w-3 h-3 text-[var(--text-muted)] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-up)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-[9990]">
                <div className="px-3 py-2.5 border-b border-[var(--border)]">
                  <div className="text-[12px] font-medium truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2.5 text-[12px] font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-10 pt-8">
        <div className="animate-fade-up delay-1 flex items-end justify-between mb-3">
          <div>
            <h1 className="font-[var(--display)] text-[32px] font-extrabold tracking-tight leading-tight mb-2">
              Your widgets
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {connectedCount > 0
                ? `${connectedCount} integration${connectedCount > 1 ? "s" : ""} connected`
                : "No integrations connected yet"}
              {" · "}
              <Link
                href="/get-started?nav=integrations"
                className="text-[var(--accent)] no-underline font-semibold"
              >
                Manage
              </Link>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefreshAll}
              disabled={refreshing || savedWidgets.length === 0}
              className="px-4 py-2 bg-[var(--bg-up)] border border-[var(--border-up)] rounded-lg text-[var(--text-muted)] text-xs font-semibold font-[var(--sans)] cursor-pointer disabled:opacity-50 disabled:cursor-wait hover:border-[var(--text-muted)] transition-colors"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
            <Link
              href="/get-started?nav=widgets"
              className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded-lg text-xs font-bold no-underline flex items-center hover:brightness-110 transition-all"
            >
              + Add Widget
            </Link>
          </div>
        </div>
      </div>

      {/* Widget grid */}
      <main className="relative z-10 max-w-[1100px] mx-auto px-10 py-6 pb-20">
        {savedWidgets.length === 0 ? (
          <div className="animate-fade-up delay-2 text-center py-20 px-5 bg-[var(--bg-up)] border border-[var(--border)] rounded-2xl">
            <div className="text-[40px] mb-4">📱</div>
            <div className="font-[var(--display)] text-xl font-bold mb-2">
              No widgets yet
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto mb-6 leading-relaxed">
              Add widget layouts and they&apos;ll render here with your real
              calendar and task data.
            </p>
            <Link
              href="/get-started?nav=widgets"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-[10px] text-sm font-bold no-underline hover:brightness-110 transition-all"
            >
              + Add Your First Widget
            </Link>
          </div>
        ) : (
          <div className="animate-fade-up delay-2 flex flex-wrap gap-5 items-start">
            {savedWidgets.map((widget) => {
              const meta = LAYOUT_META[widget.layoutId];
              if (!meta) return null;
              const blobUrl = htmlBlobs[widget.id];
              const loading = loadingWidgets.has(widget.id);

              return (
                <div key={widget.id} className="flex flex-col gap-2.5">
                  {/* Live HTML preview */}
                  <div
                    className="rounded-2xl overflow-hidden bg-[var(--bg-up)] border border-[var(--border-up)] relative"
                    style={{ width: meta.w, height: meta.h }}
                  >
                    {loading && !blobUrl && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-[1]">
                        <div className="w-5 h-5 border-2 border-[var(--border-up)] border-t-[var(--accent)] rounded-full animate-spin" />
                        <span className="text-[11px] text-[var(--text-muted)] font-[var(--mono)]">
                          Generating...
                        </span>
                      </div>
                    )}
                    {blobUrl && (
                      <iframe
                        src={blobUrl}
                        title={meta.label}
                        className="border-none block rounded-2xl pointer-events-none"
                        style={{ width: meta.w, height: meta.h }}
                        sandbox=""
                      />
                    )}
                    {!loading && !blobUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-[var(--text-muted)]">
                          Failed to load
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between pl-0.5">
                    <div>
                      <div className="text-[13px] font-semibold">
                        {meta.label}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] font-[var(--mono)]">
                        {meta.size}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(widget.id)}
                      className="px-2.5 py-1 bg-red-500/8 border border-red-500/15 rounded-md text-[11px] font-semibold text-red-400 cursor-pointer font-[var(--sans)] hover:bg-red-500/15 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
