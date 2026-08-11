import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoTtlIndexEnsured: boolean | undefined;
}

function createClient(): MongoClient {
  const uri = process.env.MONGO_CONNECTION_STRING;
  if (!uri) {
    throw new Error("MONGO_CONNECTION_STRING is not set");
  }

  return new MongoClient(uri, {
    maxPoolSize: 100,
    minPoolSize: 10,
    maxIdleTimeMS: 45000,
    retryWrites: true,
  });
}

function getClientPromise(): Promise<MongoClient> {
  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = createClient().connect();
  }
  return globalThis._mongoClientPromise;
}

async function ensureTtlIndex(db: Db): Promise<void> {
  if (globalThis._mongoTtlIndexEnsured) {
    return;
  }

  await db.collection("danny_messages").createIndex(
    { ttl: 1 },
    { expireAfterSeconds: 0 }
  );
  globalThis._mongoTtlIndexEnsured = true;
}

export async function getDb(): Promise<Db> {
  const databaseName = process.env.MONGO_DATABASE;
  if (!databaseName) {
    throw new Error("MONGO_DATABASE is not set");
  }

  const client = await getClientPromise();
  const db = client.db(databaseName);
  await ensureTtlIndex(db);
  return db;
}
