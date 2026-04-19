import { promises as fs } from "fs";
import path from "path";

import { unstable_noStore as noStore } from "next/cache";
import { doc, getDoc } from "firebase/firestore/lite";

import { getFirebaseServerDb, hasFirebaseConfig } from "@/lib/firebase";
import { getMongoDb } from "@/lib/mongodb";
import { normalizeSiteData } from "@/lib/normalizeSiteData";
import { defaultSiteConfig } from "@/models/defaultSiteConfig";
import { SITE_CONFIG_COLLECTION, SITE_CONFIG_DOCUMENT_ID } from "@/services/siteConfigDocument";
import type { SiteConfig } from "@/types/siteConfig";

const siteConfigFilePath = path.join(process.cwd(), "storage", "site-config.json");

type SiteConfigSource = "firebase" | "file" | "mongodb";

function hasFirebaseSiteConfigStore() {
  return hasFirebaseConfig();
}

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

async function readSiteConfigFromFirebase() {
  const db = getFirebaseServerDb();
  const snapshot = await getDoc(doc(db, SITE_CONFIG_COLLECTION, SITE_CONFIG_DOCUMENT_ID));
  const data = snapshot.data();

  return {
    exists: Boolean(data?.config),
    config: data?.config ?? null
  };
}

async function readSiteConfigSource() {
  if (hasFirebaseSiteConfigStore()) {
    try {
      const firebaseDocument = await readSiteConfigFromFirebase();

      if (firebaseDocument.exists && firebaseDocument.config) {
        return {
          source: "firebase" as const,
          config: firebaseDocument.config
        };
      }

      return {
        source: "file" as const,
        config: await readSiteConfigFromFile()
      };
    } catch {
      return {
        source: "firebase" as const,
        config: defaultSiteConfig
      };
    }
  }

  if (hasMongoSiteConfigStore()) {
    try {
      const db = await getMongoDb();
      const document = await db.collection("site_configs").findOne({
        key: SITE_CONFIG_DOCUMENT_ID
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
  }

  return {
    source: "file" as const,
    config: await readSiteConfigFromFile()
  };
}

async function getResolvedSiteConfig() {
  noStore();

  const { source, config } = await readSiteConfigSource();

  return {
    source,
    config: normalizeSiteData(config)
  };
}

export async function getSiteConfig() {
  const { config } = await getResolvedSiteConfig();
  return config;
}

export async function getSiteConfigWithSource() {
  return getResolvedSiteConfig();
}

export async function saveSiteConfig(input: unknown): Promise<{
  config: SiteConfig;
  source: SiteConfigSource;
}> {
  if (hasFirebaseSiteConfigStore()) {
    throw new Error(
      "Firebase-backed site config must be saved through the authenticated Firebase admin client."
    );
  }

  const config = normalizeSiteData(input);

  if (hasMongoSiteConfigStore()) {
    try {
      const db = await getMongoDb();
      await db.collection("site_configs").updateOne(
        { key: SITE_CONFIG_DOCUMENT_ID },
        {
          $set: {
            key: SITE_CONFIG_DOCUMENT_ID,
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

  await fs.mkdir(path.dirname(siteConfigFilePath), { recursive: true });
  await fs.writeFile(siteConfigFilePath, JSON.stringify(config, null, 2), "utf8");

  return {
    config,
    source: "file"
  };
}
