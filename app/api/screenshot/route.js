import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright-core";
import { NextResponse } from "next/server";

// Playwright needs a real Node.js process (spawns a browser binary),
// so this route can't run on the Edge runtime.
export const runtime = "nodejs";
// Allow slower cold-start captures on hosts that support it (e.g. Vercel Pro).
export const maxDuration = 60;

const PRESET_SIZES = [
  { name: "Desktop", width: 1920, height: 1080 },
  { name: "Tablet", width: 1024, height: 768 },
  { name: "Mobile", width: 390, height: 844 },
  { name: "Social card", width: 1200, height: 630 },
  { name: "Square", width: 1080, height: 1080 },
];

function normalizeUrl(input) {
  let value = String(input || "").trim();
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  return value;
}

// Basic SSRF guard: block localhost / private-network / link-local targets
// so the endpoint can't be used to probe internal infrastructure.
function assertPublicUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }
  const host = parsed.hostname.toLowerCase();
  const blockedExact = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
  const privateRanges =
    /^(10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.|169\.254\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;
  if (
    blockedExact.has(host) ||
    host.endsWith(".local") ||
    privateRanges.test(host)
  ) {
    throw new Error("That address isn't allowed.");
  }
  return parsed;
}

function clampDimension(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.round(n), 200), 3000);
}

export async function POST(req) {
  let browser;
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Enter a URL first." },
        { status: 400 },
      );
    }

    const requestedSizes =
      Array.isArray(body?.sizes) && body.sizes.length > 0
        ? body.sizes
        : PRESET_SIZES;
    // Hard cap so one request can't be used to spin up dozens of navigations.
    const sizes = requestedSizes.slice(0, 8).map((s, i) => ({
      name: s?.name || `Custom ${i + 1}`,
      width: clampDimension(s?.width, 1280),
      height: clampDimension(s?.height, 800),
    }));

    const normalized = normalizeUrl(rawUrl);
    assertPublicUrl(normalized);

    const browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (compatible; FramelyBot/1.0; +https://framely.example/bot)",
    });
    const page = await context.newPage();

    const results = [];
    for (const size of sizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto(normalized, { waitUntil: "networkidle", timeout: 20000 });

      // Two quality tiers from the same capture: a lossless PNG for print/design
      // use, and a compressed JPEG for fast web/portfolio embeds.
      const pngBuffer = await page.screenshot({ type: "png" });
      const jpegBuffer = await page.screenshot({ type: "jpeg", quality: 70 });

      results.push({
        name: size.name,
        width: size.width,
        height: size.height,
        png: `data:image/png;base64,${pngBuffer.toString("base64")}`,
        jpeg: `data:image/jpeg;base64,${jpegBuffer.toString("base64")}`,
      });
    }

    await context.close();
    await browser.close();

    return NextResponse.json({ url: normalized, results });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    const message =
      err instanceof Error ? err.message : "Screenshot capture failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
