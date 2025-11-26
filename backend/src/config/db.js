import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async (uri) => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
  logger.info('MongoDB connected');
};

export default connectDB;
