import { MetadataRoute } from "next";
import { query } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.goal-genius.net";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/predictions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/accuracy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let matchRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await query(
      `SELECT match_id, date_time
       FROM matches
       WHERE date_time >= NOW() - INTERVAL '30 days'
       ORDER BY date_time DESC
       LIMIT 1000`
    );
    matchRoutes = result.rows.map((row) => ({
      url: `${baseUrl}/match/${row.match_id}`,
      lastModified: new Date(row.date_time),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time — skip match routes
  }

  return [...staticRoutes, ...matchRoutes];
}
