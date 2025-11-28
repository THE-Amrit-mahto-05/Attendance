const mongoose = require('mongoose');

const connectDB = async () => {
  const { MONGO_URI = 'mongodb://127.0.0.1:27017/classcheck' } = process.env;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
