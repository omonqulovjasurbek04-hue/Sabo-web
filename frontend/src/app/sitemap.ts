import type { MetadataRoute } from "next";

import { apiClient } from "@/lib/api-client";
import { locales } from "@/lib/i18n/locales";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().replace(/\/$/, "");
  const productsRes = await apiClient.getProducts({ limit: 200 });
  const products = productsRes.data || [];
  const now = new Date();

  const staticPaths: Array<{
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" },
    { path: "/production", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/certificates", priority: 0.6, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const item of staticPaths) {
      entries.push({
        url: `${base}/${locale}${item.path}`,
        lastModified: now,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}${item.path}`]),
          ),
        },
      });
    }

    for (const product of products) {
      entries.push({
        url: `${base}/${locale}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}/products/${product.slug}`]),
          ),
        },
      });
    }
  }

  return entries;
}