import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.error(`No token provided - ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-password');
    if (!req.user) {
      logger.error(`Auth failed - user not found for id: ${payload.id}`);
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    logger.error(`Invalid token on ${req.method} ${req.originalUrl}: ${err.message}`);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
