import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { PERSONAL_PROJECTS } from "@/shared/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...PERSONAL_PROJECTS.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
