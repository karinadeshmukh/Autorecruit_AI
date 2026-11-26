import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/autorecruit";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongo = globalThis as unknown as { mongooseCache?: Cache };

const cache: Cache = globalForMongo.mongooseCache ?? { conn: null, promise: null };
globalForMongo.mongooseCache = cache;

export async function dbConnect() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
