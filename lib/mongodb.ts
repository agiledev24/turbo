import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environmental variable inside .env.local");
  }

  const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1, // Using stable API version
  });

  try {
    await client.connect();
    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
}
