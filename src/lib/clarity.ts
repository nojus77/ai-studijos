// Microsoft Clarity Data Export API client.
// Docs: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api
//
// GET project-live-insights returns aggregated dashboard metrics for the last
// `numOfDays` (1-3). A single call (no dimensions) already returns every metric
// we need — Traffic, ScrollDepth, EngagementTime, PopularPages, ReferrerUrl —
// so the daily report makes just one request (well within the 10/day limit).
// Auth is a JWT token from Clarity → Settings → Data Export. Values are UTC.
//
// Verified response shapes (2026-06):
//   Traffic        → [{ totalSessionCount, totalBotSessionCount, distinctUserCount, pagesPerSessionPercentage }]
//   ScrollDepth    → [{ averageScrollDepth }]
//   EngagementTime → [{ totalTime, activeTime }]            (seconds)
//   PopularPages   → [{ url, visitsCount }, ...]
//   ReferrerUrl    → [{ name, sessionsCount }, ...]         (name null = direct)

const CLARITY_ENDPOINT =
  "https://www.clarity.ms/export-data/api/v1/project-live-insights";

export type ClarityDimension =
  | "Browser"
  | "Device"
  | "Country/Region"
  | "OS"
  | "Source"
  | "Medium"
  | "Campaign"
  | "Channel"
  | "URL";

export interface ClarityMetric {
  metricName: string;
  information: Array<Record<string, string | number | null>>;
}

/**
 * Raw fetch of Clarity insights. Returns null when no token is configured or
 * on any error — the daily report degrades gracefully (Stripe conversions
 * still send).
 */
export async function fetchClarityInsights(
  numOfDays: 1 | 2 | 3,
  dimensions: ClarityDimension[] = [],
): Promise<ClarityMetric[] | null> {
  const token = process.env.CLARITY_API_TOKEN;
  if (!token) return null;

  const params = new URLSearchParams({ numOfDays: String(numOfDays) });
  dimensions.slice(0, 3).forEach((d, i) => params.set(`dimension${i + 1}`, d));

  try {
    const res = await fetch(`${CLARITY_ENDPOINT}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[clarity] fetch failed", res.status, body.slice(0, 200));
      return null;
    }
    const json = (await res.json()) as unknown;
    return Array.isArray(json) ? (json as ClarityMetric[]) : null;
  } catch (error) {
    console.error("[clarity] fetch threw", error);
    return null;
  }
}

// ───────────────────── extractors ─────────────────────

const toNum = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
};

/** First field whose (case-insensitive) name matches one of `keys`. */
const pick = (
  row: Record<string, string | number | null>,
  keys: string[],
): number => {
  const wanted = keys.map((k) => k.toLowerCase());
  for (const k of Object.keys(row)) {
    if (wanted.includes(k.toLowerCase())) return toNum(row[k]);
  }
  return 0;
};

function findMetric(
  metrics: ClarityMetric[],
  nameSubstr: string,
): ClarityMetric | undefined {
  const want = nameSubstr.toLowerCase().replace(/\s+/g, "");
  return metrics.find((m) =>
    m.metricName.toLowerCase().replace(/\s+/g, "").includes(want),
  );
}

export interface TrafficSummary {
  sessions: number;
  botSessions: number;
  users: number;
}

export function summarizeTraffic(metrics: ClarityMetric[]): TrafficSummary {
  const row = findMetric(metrics, "traffic")?.information?.[0];
  if (!row) return { sessions: 0, botSessions: 0, users: 0 };
  return {
    sessions: pick(row, ["totalSessionCount", "sessionCount"]),
    botSessions: pick(row, ["totalBotSessionCount", "botSessionCount"]),
    users: pick(row, ["distinctUserCount", "distantUserCount", "userCount"]),
  };
}

export interface EngagementSummary {
  activeTimeSec?: number;
  totalTimeSec?: number;
  scrollDepthPct?: number;
}

const msToSec = (v: number): number => (v > 6000 ? v / 1000 : v);

export function summarizeEngagement(
  metrics: ClarityMetric[],
): EngagementSummary {
  const out: EngagementSummary = {};

  const engRow = findMetric(metrics, "engagementtime")?.information?.[0];
  if (engRow) {
    const active = pick(engRow, ["activeTime", "averageActiveTime"]);
    const total = pick(engRow, ["totalTime", "averageTotalTime"]);
    if (active > 0) out.activeTimeSec = msToSec(active);
    if (total > 0) out.totalTimeSec = msToSec(total);
  }

  const scrollRow = findMetric(metrics, "scrolldepth")?.information?.[0];
  if (scrollRow) {
    const v = pick(scrollRow, ["averageScrollDepth", "scrollDepth"]);
    if (v > 0) out.scrollDepthPct = v <= 1 ? v * 100 : v;
  }

  return out;
}

export interface PageVisits {
  url: string;
  visits: number;
}

/** Per-page visit counts from the PopularPages metric ({ url, visitsCount }). */
export function popularPages(metrics: ClarityMetric[]): PageVisits[] {
  const rows = findMetric(metrics, "popularpages")?.information ?? [];
  return rows
    .map((row) => ({
      url: String(row.url ?? row.name ?? "—"),
      visits: pick(row, ["visitsCount", "sessionsCount", "totalSessionCount"]),
    }))
    .sort((a, b) => b.visits - a.visits);
}

/** Total page visits whose URL path passes `pathTest`. */
export function pathVisits(
  pages: PageVisits[],
  pathTest: (path: string) => boolean,
): number {
  return pages.reduce((sum, p) => {
    let path = p.url;
    try {
      path = new URL(p.url).pathname;
    } catch {
      // already a path
    }
    return pathTest(path) ? sum + p.visits : sum;
  }, 0);
}

export interface SourceCount {
  source: string;
  sessions: number;
}

/** Collapse a raw referrer into a clean source label. null/own domain → direct. */
function normalizeReferrer(name: unknown): string {
  if (!name) return "tiesioginis";
  let host = String(name);
  try {
    host = new URL(String(name)).hostname;
  } catch {
    // not a URL — use as-is
  }
  host = host
    .replace(/^www\./, "")
    .replace(/^m\./, "")
    .toLowerCase();
  if (host.includes("facebook") || host.includes("fb.")) return "facebook";
  if (host.includes("instagram")) return "instagram";
  if (host.includes("google")) return "google";
  if (host.includes("bing")) return "bing";
  if (host.includes("tiktok")) return "tiktok";
  if (host.includes("youtube") || host.includes("youtu.be")) return "youtube";
  if (host.includes("aistudijos.lt")) return "tiesioginis";
  return host || "tiesioginis";
}

/** Sessions per normalized referrer source, from the ReferrerUrl metric. */
export function topReferrers(metrics: ClarityMetric[]): SourceCount[] {
  const rows = findMetric(metrics, "referrer")?.information ?? [];
  const map = new Map<string, number>();
  for (const row of rows) {
    const src = normalizeReferrer(row.name);
    map.set(src, (map.get(src) ?? 0) + pick(row, ["sessionsCount"]));
  }
  return [...map.entries()]
    .map(([source, sessions]) => ({ source, sessions }))
    .sort((a, b) => b.sessions - a.sessions);
}

export interface FrustrationSummary {
  deadClicksPct: number;
  rageClicksPct: number;
  quickBacksPct: number;
  jsErrorsPct: number;
  excessiveScrollPct: number;
}

/**
 * Frustration signals — the "what's broken" metrics. Each metric row carries
 * `sessionsWithMetricPercentage` (% of sessions that hit it). These surface
 * where a funnel leaks: dead clicks on a non-button, rage clicks, quick-backs
 * (instant bounce), JS errors.
 */
export function summarizeFrustration(
  metrics: ClarityMetric[],
): FrustrationSummary {
  const pctOf = (name: string): number => {
    const row = findMetric(metrics, name)?.information?.[0];
    return row ? pick(row, ["sessionsWithMetricPercentage"]) : 0;
  };
  return {
    deadClicksPct: pctOf("deadclick"),
    rageClicksPct: pctOf("rageclick"),
    quickBacksPct: pctOf("quickback"),
    jsErrorsPct: Math.max(pctOf("scripterror"), pctOf("errorclick")),
    excessiveScrollPct: pctOf("excessivescroll"),
  };
}
