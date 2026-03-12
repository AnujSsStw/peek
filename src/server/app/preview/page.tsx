"use client";

import { useEffect, useState } from "react";

interface WidgetEntry {
  label: string;
  layout: string;
  variant: string;
  width: number;
  height: number;
}

const SECTIONS: { title: string; widgets: WidgetEntry[] }[] = [
  {
    title: "Contextual Hero (2×2)",
    widgets: [
      "morning",
      "urgent",
      "night",
      "focus",
      "alert",
      "calm",
      "weather",
      "energy",
      "eink",
    ].map((v) => ({
      label: v,
      layout: "contextual-hero",
      variant: v,
      width: 170,
      height: 170,
    })),
  },
  {
    title: "Bento Box (2×4)",
    widgets: ["frost", "cream", "charcoal", "ocean", "neon", "eink"].map(
      (v) => ({
        label: v,
        layout: "bento-box",
        variant: v,
        width: 360,
        height: 180,
      }),
    ),
  },
  {
    title: "Timeline (4×4)",
    widgets: ["light", "dark", "emerald", "amber", "eink"].map((v) => ({
      label: v,
      layout: "timeline",
      variant: v,
      width: 340,
      height: 360,
    })),
  },
  {
    title: "Timeline + Tasks — Inline",
    widgets: ["light", "dark"].map((v) => ({
      label: `inline / ${v}`,
      layout: "timeline-tasks",
      variant: `inline/${v}`,
      width: 340,
      height: 360,
    })),
  },
  {
    title: "Timeline + Tasks — Pinned Block",
    widgets: ["light", "dark"].map((v) => ({
      label: `pinned / ${v}`,
      layout: "timeline-tasks",
      variant: `pinned/${v}`,
      width: 340,
      height: 360,
    })),
  },
  {
    title: "Timeline + Tasks — Nested Sub-tasks",
    widgets: ["light", "dark"].map((v) => ({
      label: `nested / ${v}`,
      layout: "timeline-tasks",
      variant: `nested/${v}`,
      width: 340,
      height: 360,
    })),
  },
  {
    title: "Timeline + Tasks — Floating Card",
    widgets: ["light", "dark"].map((v) => ({
      label: `floating / ${v}`,
      layout: "timeline-tasks",
      variant: `floating/${v}`,
      width: 340,
      height: 360,
    })),
  },
  {
    title: "Timeline + Tasks — Progress Header",
    widgets: ["light", "dark"].map((v) => ({
      label: `progress / ${v}`,
      layout: "timeline-tasks",
      variant: `progress/${v}`,
      width: 340,
      height: 360,
    })),
  },
  {
    title: "Minimalist Stack (2×4)",
    widgets: [
      "light",
      "dark",
      "editorial",
      "ink",
      "brutal",
      "neon",
      "eink",
    ].map((v) => ({
      label: v,
      layout: "minimalist-stack",
      variant: v,
      width: 360,
      height: 170,
    })),
  },
  {
    title: "Progress Ring (2×2)",
    widgets: ["dark", "light"].map((v) => ({
      label: v,
      layout: "progress-ring",
      variant: v,
      width: 170,
      height: 170,
    })),
  },
  {
    title: "Companion Quote (2×4)",
    widgets: ["warm", "frost"].map((v) => ({
      label: v,
      layout: "companion-quote",
      variant: v,
      width: 360,
      height: 170,
    })),
  },
  {
    title: "Streak Flame (2×2)",
    widgets: ["fire", "cool"].map((v) => ({
      label: v,
      layout: "streak-flame",
      variant: v,
      width: 170,
      height: 170,
    })),
  },
  {
    title: "Daily Score (2×4)",
    widgets: ["dark", "light"].map((v) => ({
      label: v,
      layout: "daily-score",
      variant: v,
      width: 360,
      height: 170,
    })),
  },
];

function WidgetImage({ entry }: { entry: WidgetEntry }) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        width: entry.width,
        height: entry.height,
        layout: entry.layout,
        variant: entry.variant,
        useMockData: true,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error ?? `HTTP ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        setSrc(URL.createObjectURL(blob));
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [entry]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center rounded-lg bg-zinc-900/50"
        style={{ width: entry.width, height: entry.height }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
          </div>
        )}
        {error && (
          <div className="p-2 text-center text-xs text-red-400">{error}</div>
        )}
        {src && (
          <img
            src={src}
            alt={`${entry.layout} — ${entry.label}`}
            width={entry.width}
            height={entry.height}
            className="rounded-lg"
          />
        )}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        {entry.label}
      </span>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#08080a] px-6 py-16 text-[#eae8e3]">
      <div className="mx-auto max-w-350">
        <h1 className="mb-2 font-serif text-4xl font-bold tracking-tight">
          Widget Screenshot Preview
        </h1>
        <p className="mb-16 text-sm text-zinc-500">
          Every layout, every variant — rendered via POST /api/screenshot with
          mock data from widget-variants.html
        </p>

        {SECTIONS.map((section) => (
          <section key={section.title} className="mb-16">
            <h2 className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c4f24a]">
              {section.title}
            </h2>
            <div className="mb-6 h-px bg-white/5" />
            <div className="flex flex-wrap gap-5">
              {section.widgets.map((w) => (
                <WidgetImage
                  key={`${w.layout}-${w.variant}-${w.label}`}
                  entry={w}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
