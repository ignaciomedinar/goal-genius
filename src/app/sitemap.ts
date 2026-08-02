import { MetadataRoute } from "next";
import { query } from "@/lib/db";

const pages = [
  { path: "",        changeFrequency: "daily"   as const, priority: 1.0 },
  { path: "/predictions", changeFrequency: "daily"   as const, priority: 0.9 },
  { path: "/results",     changeFrequency: "daily"   as const, priority: 0.9 },
  { path: "/accuracy",    changeFrequency: "weekly"  as const, priority: 0.8 },
  { path: "/how-it-works",changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/about",       changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/contact",     changeFrequency: "monthly" as const, priority: 0.4 },
  { path: "/privacy",     changeFrequency: "yearly"  as const, priority: 0.3 },
  { path: "/terms",       changeFrequency: "yearly"  as const, priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.goal-genius.net";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = pages.flatMap(({ path, changeFrequency, priority }) => [
    { url: `${baseUrl}${path}`,       lastModified: now, changeFrequency, priority },
    { url: `${baseUrl}/es${path}`,    lastModified: now, changeFrequency, priority: priority * 0.95 },
  ]);

  let matchRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await query(
      `SELECT match_id, date_time
       FROM matches
       WHERE date_time >= NOW() - INTERVAL '30 days'
       ORDER BY date_time DESC
       LIMIT 1000`
    );
    matchRoutes = result.rows.flatMap((row) => [
      {
        url: `${baseUrl}/match/${row.match_id}`,
        lastModified: new Date(row.date_time),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/es/match/${row.match_id}`,
        lastModified: new Date(row.date_time),
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
    ]);
  } catch {
    // DB unavailable at build time — skip match routes
  }

  return [...staticRoutes, ...matchRoutes];
}
