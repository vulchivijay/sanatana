/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  // Allow server startup; real error will occur when trying to connect
  console.warn("MONGODB_URI not set");
}

const uri = process.env.MONGODB_URI as string;
const cached: { client: MongoClient | null; promise: Promise<MongoClient> | null } = { client: null, promise: null };

export async function connectToDatabase() {
  if (cached.client) return { client: cached.client };

  if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then(() => client);
  }

  const client = await cached.promise;
  cached.client = client;
  return { client };
}

export function getCollection(name: string) {
  if (!cached.client) throw new Error("Mongo client not connected");
  return cached.client.db().collection(name);
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
