"use client";

import { useEffect, useState } from "react";
import { WidgetEntry } from "./page";

const CONCURRENCY = 100;
type QueueItem = {
  entry: WidgetEntry;
  resolve: (blob: Blob) => void;
  reject: (err: Error) => void;
};
const queue: QueueItem[] = [];
let running = 0;

function enqueue(entry: WidgetEntry): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    queue.push({ entry, resolve, reject });
    flush();
  });
}

function flush() {
  while (running < CONCURRENCY && queue.length > 0) {
    const item = queue.shift()!;
    running++;
    fetchWidget(item.entry)
      .then(item.resolve)
      .catch(item.reject)
      .finally(() => {
        running--;
        flush();
      });
  }
}

async function fetchWidget(entry: WidgetEntry): Promise<Blob> {
  const res = await fetch("/api/screenshot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      width: entry.width,
      height: entry.height,
      layout: entry.layout,
      variant: entry.variant,
      useMockData: true,
    }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error ?? `HTTP ${res.status}`);
  }
  return res.blob();
}

export function WidgetImage({ entry }: { entry: WidgetEntry }) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    enqueue(entry)
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
