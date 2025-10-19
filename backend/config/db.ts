import mongoose from 'mongoose';
import 'colors';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MongoDB connection string not found in environment variables'.red.bold);
      process.exit(1);
    }

    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    } as any;

    const conn = await mongoose.connect(mongoUri, options);
    
    mongoose.connection.on('error', (err: Error) => {
      console.error(`MongoDB connection error: ${err.message}`.red.bold);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected, attempting to reconnect...'.yellow);
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
    return conn.connection;
  } catch (err: any) {
    console.error(`MongoDB Connection Error: ${err.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
