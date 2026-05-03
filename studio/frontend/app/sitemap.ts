import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://guard-flow-v1.vercel.app";

const staticRoutes = [
  "",
  "/docs",
  "/sdk-guide",
  "/login",
  "/register",
  "/dashboard",
  "/projects",
  "/threats",
  "/analytics",
  "/blacklist",
  "/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
