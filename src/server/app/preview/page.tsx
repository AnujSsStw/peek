import { WidgetImage } from "./WidgetImage";

export interface WidgetEntry {
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
        <PreviewGrid />
      </div>
    </div>
  );
}

function PreviewGrid() {
  return (
    <>
      {SECTIONS.map((section, sectionIdx) => (
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
    </>
  );
}
