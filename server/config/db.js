const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim().length > 0 && !mongoUri.includes('<username>')) {
      console.log('🔄 Attempting connection to specified MongoDB URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected to Cloud/Host: ${conn.connection.host}`);
      return conn;
    }

    console.log('💡 No active MongoDB Atlas URI provided in MONGODB_URI. Initializing in-memory Cloud Database instance...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'autocloud',
      }
    });
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB In-Memory Server Active & Connected at: ${uri}`);
    console.log('✨ (To switch to MongoDB Atlas, set MONGODB_URI in server/.env)');
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Fallback to memory server if remote connection failed
    try {
      console.log('⚠️ Falling back to In-Memory MongoDB Server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'autocloud',
        }
      });
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Fallback Server Connected at: ${uri}`);
      return conn;
    } catch (fallbackErr) {
      console.error('❌ Critical MongoDB Fallback Error:', fallbackErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB disconnected successfully');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
