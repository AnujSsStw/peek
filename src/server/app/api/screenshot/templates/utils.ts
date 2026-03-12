const ESC_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function esc(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ESC_MAP[c] ?? c);
}
