import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo";

const routes = ["/", "/products", "/blogs", "/about-us", "/contact-us"];

export default function sitemap(): MetadataRoute.Sitemap {
  const timestamp = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: timestamp
  }));
}
