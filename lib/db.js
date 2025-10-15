import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let db;

export async function connectDB() {
  if (db) return { client, db }; 
  try {
    client = await MongoClient.connect(uri);
    db = client.db(); 
    console.log("✅ MongoDB Connected");
    return { client, db };
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
