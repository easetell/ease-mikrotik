import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGO_URI;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use global cache to persist DB connection across API calls
let cached: MongooseConnection = (global as any).mongoose || {
  conn: null,
  promise: null,
};

const connectDB = async () => {
  if (cached.conn) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  console.log("Establishing new database connection...");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "mikrotikDB",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  (global as any).mongoose = cached; // Store in global scope

  console.log("Database connected successfully");

  return cached.conn;
};

export default connectDB;
