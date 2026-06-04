// Microsoft Clarity Data Export API client.
// Docs: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api
//
// GET project-live-insights returns aggregated dashboard metrics for the last
// `numOfDays` (1-3), optionally broken down by up to 3 dimensions. Auth is a
// JWT token generated in Clarity → Settings → Data Export → Generate new API
// token. Hard limits: 10 requests / project / day, max 3 days of data, 1000
// rows, no pagination. The API returns values in UTC.

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
  information: Array<Record<string, string | number>>;
}

/**
 * Raw fetch of Clarity insights. Returns null when no token is configured or
 * on any error — the daily report degrades gracefully (Stripe conversions
 * still send). Field names in the response are inconsistent across metrics
 * (e.g. "distantUserCount", "PagesPerSessionPercentage"), so all extraction
 * below is defensive.
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

// ───────────────────── defensive extractors ─────────────────────

const toNum = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
};

/** First field whose (case-insensitive) name matches one of `keys`. */
const pick = (row: Record<string, unknown>, keys: string[]): number => {
  const wanted = keys.map((k) => k.toLowerCase());
  for (const k of Object.keys(row)) {
    if (wanted.includes(k.toLowerCase())) return toNum(row[k]);
  }
  return 0;
};

export function findMetric(
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
  const rows = findMetric(metrics, "traffic")?.information ?? [];
  let sessions = 0;
  let botSessions = 0;
  let users = 0;
  for (const row of rows) {
    sessions += pick(row, ["totalSessionCount", "sessionCount"]);
    botSessions += pick(row, ["totalBotSessionCount", "botSessionCount"]);
    users += pick(row, ["distinctUserCount", "distantUserCount", "userCount"]);
  }
  return { sessions, botSessions, users };
}

export interface DimCount {
  name: string;
  sessions: number;
}

/** Sessions per value of a dimension (e.g. Source) — sorted desc. */
export function summarizeByDimension(
  metrics: ClarityMetric[],
  dimKey: string,
): DimCount[] {
  const rows = findMetric(metrics, "traffic")?.information ?? [];
  return rows
    .map((row) => {
      const nameKey = Object.keys(row).find(
        (k) => k.toLowerCase() === dimKey.toLowerCase(),
      );
      const name = nameKey ? String(row[nameKey]) : "—";
      return { name: name || "—", sessions: pick(row, ["totalSessionCount"]) };
    })
    .sort((a, b) => b.sessions - a.sessions);
}

/** Top pages by visit count, from the Popular Pages / Page Title metric. */
export function summarizePopularPages(metrics: ClarityMetric[]): DimCount[] {
  const rows =
    (findMetric(metrics, "popular") ?? findMetric(metrics, "pagetitle"))
      ?.information ?? [];
  return rows
    .map((row) => {
      let name = "—";
      let visits = 0;
      for (const [k, v] of Object.entries(row)) {
        if (typeof v === "string" && !/^\d+(\.\d+)?$/.test(v)) name = v;
        else visits = Math.max(visits, toNum(v));
        void k;
      }
      return { name, sessions: visits };
    })
    .sort((a, b) => b.sessions - a.sessions);
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

  const engRow = (
    findMetric(metrics, "engagement") ?? findMetric(metrics, "time")
  )?.information?.[0];
  if (engRow) {
    const active = pick(engRow, [
      "activeTime",
      "averageActiveTime",
      "averageEngagementTime",
      "engagementTime",
    ]);
    const total = pick(engRow, ["totalTime", "averageTotalTime"]);
    if (active > 0) out.activeTimeSec = msToSec(active);
    if (total > 0) out.totalTimeSec = msToSec(total);
    // Fallback: if no named field matched, take the largest numeric field.
    if (!out.activeTimeSec && !out.totalTimeSec) {
      const v = Math.max(0, ...Object.values(engRow).map(toNum));
      if (v > 0) out.activeTimeSec = msToSec(v);
    }
  }

  const scrollRow = findMetric(metrics, "scroll")?.information?.[0];
  if (scrollRow) {
    const v =
      pick(scrollRow, ["averageScrollDepth", "scrollDepth"]) ||
      Math.max(0, ...Object.values(scrollRow).map(toNum));
    if (v > 0) out.scrollDepthPct = v <= 1 ? v * 100 : v;
  }

  return out;
}

/** Sessions for URLs whose path passes `pathTest`, summed across rows. Pass a
 *  URL-dimension breakdown (summarizeByDimension(metrics, "URL")). */
export function sessionsForPath(
  urlCounts: DimCount[],
  pathTest: (path: string) => boolean,
): number {
  return urlCounts.reduce((sum, c) => {
    let path = c.name;
    try {
      path = new URL(c.name).pathname;
    } catch {
      // already a path (or a page title) — test as-is
    }
    return pathTest(path) ? sum + c.sessions : sum;
  }, 0);
}
