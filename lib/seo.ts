import type { Metadata } from "next";

import { defaultSiteConfig } from "@/models/defaultSiteConfig";

export const siteConfig = {
  name: defaultSiteConfig.content.siteName,
  description: defaultSiteConfig.content.siteDescription,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lomas-ai.vercel.app",
  email: defaultSiteConfig.footer.email
};

type MetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  siteName?: string;
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  siteName = siteConfig.name
}: MetadataOptions): Metadata {
  const metadataBase = new URL(siteConfig.url);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = new URL(normalizedPath, metadataBase).toString();
  const imageUrl = new URL("/opengraph-image", metadataBase).toString();
  const finalTitle = title === siteName ? title : `${title} | ${siteName}`;

  return {
    metadataBase,
    title: finalTitle,
    description,
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.png", type: "image/png" }
      ],
      apple: [{ url: "/icon.png", type: "image/png" }]
    },
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: finalTitle,
      description,
      url: canonicalUrl,
      siteName,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} preview`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description,
      images: [imageUrl]
    }
  };
}
