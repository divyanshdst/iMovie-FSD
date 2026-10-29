const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to standalone instance: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[MongoDB] Standalone daemon not found. Initializing embedded MongoDB server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[MongoDB] Embedded MongoDB instance started successfully at: ${uri}`);

      // Auto-seed initial data
      const seedData = require('../seed');
      if (typeof seedData === 'function') {
        await seedData();
      }
    } catch (memErr) {
      console.error(`[MongoDB] Failed to initialize embedded MongoDB:`, memErr.message);
    }
  }
};

module.exports = connectDB;
