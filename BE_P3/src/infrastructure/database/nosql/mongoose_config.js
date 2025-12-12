require('dotenv').config();
const mongoose = require('mongoose');

const connect = async () => {
  try {
    const uri = process.env.MONGO_URL; 
    await mongoose.connect(uri);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { mongoose, connect };