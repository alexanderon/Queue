import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryServer: { stop: () => Promise<boolean>; getUri: () => string } | null;
}

let cached = (global as typeof globalThis & { mongoose?: MongooseCache }).mongoose;

if (!cached) {
  cached = (global as typeof globalThis & { mongoose?: MongooseCache }).mongoose = {
    conn: null,
    promise: null,
    memoryServer: null,
  };
}

function isLocalMongoUri(uri: string) {
  return uri.includes('localhost') || uri.includes('127.0.0.1');
}

async function connectWithUri(uri: string) {
  return mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
}

async function startMemoryServer() {
  if (!cached!.memoryServer) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    cached!.memoryServer = await MongoMemoryServer.create();
    console.warn(
      'Local MongoDB unavailable. Using in-memory database for development:',
      cached!.memoryServer.getUri()
    );
  }

  return connectWithUri(cached!.memoryServer.getUri());
}

async function createConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    return await connectWithUri(uri);
  } catch (error) {
    const canUseMemoryDb =
      process.env.NODE_ENV === 'development' && isLocalMongoUri(uri);

    if (!canUseMemoryDb) {
      throw error;
    }

    return startMemoryServer();
  }
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = createConnection();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn;
}

export default connectDB;
