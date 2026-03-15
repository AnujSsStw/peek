"use client";

import { useState } from "react";

interface WidgetEntry {
  label: string;
  layout: string;
  variant: string;
  width: number;
  height: number;
}

export function SaveAllButton({ widgets }: { widgets: WidgetEntry[] }) {
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleSaveAll = async () => {
    setSaving(true);
    setProgress({ done: 0, total: widgets.length });

    const images = document.querySelectorAll<HTMLImageElement>(
      'img[alt^="contextual-hero"], img[alt^="bento-box"], img[alt^="timeline"], img[alt^="minimalist-stack"], img[alt^="progress-ring"], img[alt^="companion-quote"], img[alt^="streak-flame"], img[alt^="daily-score"]',
    );

    // Map loaded images by alt text
    const loaded = new Map<string, HTMLImageElement>();
    images.forEach((img) => {
      if (img.src && img.naturalWidth > 0) {
        loaded.set(img.alt, img);
      }
    });

    let done = 0;

    for (const w of widgets) {
      const alt = `${w.layout} — ${w.label}`;
      const img = loaded.get(alt);

      try {
        let blob: Blob;

        if (img) {
          // Image already loaded — fetch the blob URL directly
          const res = await fetch(img.src);
          blob = await res.blob();
        } else {
          // Not loaded yet — fetch from API
          const res = await fetch("/api/screenshot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              width: w.width,
              height: w.height,
              layout: w.layout,
              variant: w.variant,
              useMockData: true,
            }),
          });
          if (!res.ok) continue;
          blob = await res.blob();
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${w.layout}_${w.variant.replace(/\//g, "-")}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        // skip failed downloads
      }

      done++;
      setProgress({ done, total: widgets.length });
    }

    setSaving(false);
  };

  return (
    <button
      onClick={handleSaveAll}
      disabled={saving}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-medium tracking-wide text-[#c4f24a] transition-colors hover:bg-white/10 disabled:cursor-wait disabled:opacity-50"
    >
      {saving ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#c4f24a]/30 border-t-[#c4f24a]" />
          Saving {progress.done}/{progress.total}
        </>
      ) : (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Save All Images
        </>
      )}
    </button>
  );
}
