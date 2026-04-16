import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoClientPromise() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!global.mongoClientPromise) {
    const client = new MongoClient(uri);
    global.mongoClientPromise = client.connect();
  }

  return global.mongoClientPromise;
}

export async function getMongoDb() {
  const dbName = process.env.MONGODB_DB_NAME;

  if (!dbName) {
    throw new Error("Missing MONGODB_DB_NAME environment variable.");
  }

  const client = await getMongoClientPromise();
  return client.db(dbName);
}
