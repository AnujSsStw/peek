import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";

let browser: Browser | null = null;

// Chromium executable path cache + dedup for Vercel
let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

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
        : [];

  for (const p of candidates) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return null;
}

async function getChromiumPath(): Promise<string> {
  if (cachedExecutablePath) return cachedExecutablePath;

  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const chromiumPackUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
      : `https://${process.env.VERCEL_URL}/chromium-pack.tar`;

    downloadPromise = chromium
      .executablePath(chromiumPackUrl)
      .then((path: string) => {
        cachedExecutablePath = path;
        return path;
      })
      .catch((error: Error) => {
        downloadPromise = null;
        throw error;
      });
  }

  return downloadPromise;
}

export async function getBrowser(): Promise<Browser> {
  if (browser && browser.connected) {
    return browser;
  }

  const isVercel = !!process.env.VERCEL_ENV;

  if (isVercel) {
    // Vercel: use chromium-min with hosted tar
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const executablePath = await getChromiumPath();
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });
  } else {
    // Local dev: use system Chrome
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
      throw new Error(
        "No local Chrome found. Install Google Chrome or set VERCEL_ENV.",
      );
    }
  }

  browser!.on("disconnected", () => {
    browser = null;
  });

  return browser!;
}
