import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";

let browser: Browser | null = null;

function findLocalChrome(): string | null {
  const candidates =
    process.platform === "darwin"
      ? [
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ]
      : process.platform === "win32"
        ? [
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
          ];

  for (const p of candidates) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return null;
}

export async function getBrowser(): Promise<Browser> {
  if (browser && browser.connected) {
    return browser;
  }

  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    // In dev, prefer local Chrome/Chromium (sparticuz bundles a Linux binary)
    const localChrome = findLocalChrome();
    if (localChrome) {
      browser = await puppeteer.launch({
        executablePath: localChrome,
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    } else {
      // Fallback to sparticuz (works on Linux dev machines)
      const chromium = await import("@sparticuz/chromium");
      browser = await puppeteer.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });
    }
  } else {
    const chromiumMin = await import("@sparticuz/chromium-min");
    const chromiumPackUrl =
      process.env.CHROMIUM_PACK_URL ??
      `file://${process.cwd()}/public/chromium-pack.tar`;
    browser = await puppeteer.launch({
      args: chromiumMin.default.args,
      executablePath: await chromiumMin.default.executablePath(chromiumPackUrl),
      headless: true,
    });
  }

  browser.on("disconnected", () => {
    browser = null;
  });

  return browser;
}
