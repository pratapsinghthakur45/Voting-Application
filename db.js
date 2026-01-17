import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
//mongodb connection with local database
const mongodbURL = process.env.mongoDB_URL_Local;

mongoose.connect(mongodbURL);

//default connection
const db = mongoose.connection;

// Event listeners
db.on('connected', () => {
  
  console.log('✅ Connected to MongoDB server');
});

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

export default db;
