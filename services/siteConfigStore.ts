import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";

import { getMongoDb } from "@/lib/mongodb";
import { normalizeSiteData } from "@/lib/normalizeSiteData";
import { defaultSiteConfig } from "@/models/defaultSiteConfig";
import type { SiteConfig } from "@/types/siteConfig";

const SITE_CONFIG_KEY = "default-site-config";
const siteConfigFilePath = path.join(process.cwd(), "storage", "site-config.json");

type SiteConfigSource = "file" | "mongodb";

function hasMongoSiteConfigStore() {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB_NAME);
}

async function readSiteConfigFromFile() {
  try {
    const fileContents = await fs.readFile(siteConfigFilePath, "utf8");
    return JSON.parse(fileContents) as unknown;
  } catch {
    return defaultSiteConfig;
  }
}

async function writeSiteConfigToFile(config: SiteConfig) {
  await fs.mkdir(path.dirname(siteConfigFilePath), { recursive: true });
  await fs.writeFile(siteConfigFilePath, JSON.stringify(config, null, 2), "utf8");
}

async function readSiteConfigSource() {
  if (!hasMongoSiteConfigStore()) {
    return {
      source: "file" as const,
      config: await readSiteConfigFromFile()
    };
  }

  try {
    const db = await getMongoDb();
    const document = await db.collection("site_configs").findOne({
      key: SITE_CONFIG_KEY
    });

    if (document?.config) {
      return {
        source: "mongodb" as const,
        config: document.config
      };
    }
  } catch {
    // Fall through to the file-backed configuration for local resilience.
  }

  return {
    source: "file" as const,
    config: await readSiteConfigFromFile()
  };
}

async function getResolvedSiteConfig() {
  const { source, config } = await readSiteConfigSource();

  return {
    source,
    config: normalizeSiteData(config)
  };
}

export const getSiteConfig = cache(async () => {
  const { config } = await getResolvedSiteConfig();
  return config;
});

export async function getSiteConfigWithSource() {
  return getResolvedSiteConfig();
}

export async function saveSiteConfig(input: unknown): Promise<{
  config: SiteConfig;
  source: SiteConfigSource;
}> {
  const config = normalizeSiteData(input);

  if (hasMongoSiteConfigStore()) {
    try {
      const db = await getMongoDb();
      await db.collection("site_configs").updateOne(
        { key: SITE_CONFIG_KEY },
        {
          $set: {
            key: SITE_CONFIG_KEY,
            config,
            updatedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );

      return {
        config,
        source: "mongodb"
      };
    } catch {
      // Fall through to local file persistence.
    }
  }

  await writeSiteConfigToFile(config);

  return {
    config,
    source: "file"
  };
}
