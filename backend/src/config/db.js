const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`Please add your MongoDB URI to backend/.env`);
    console.error(`Server will continue running but database features won't work`);
    // Don't exit - let server run for UI testing
  }
};

module.exports = connectDB;
