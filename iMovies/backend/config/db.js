const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Failed: ${error.message}`);
    // Don't kill process immediately in local dev so instructions and non-db calls can still be inspected
  }
};

module.exports = connectDB;

