import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const generateTokens = (userId: Types.ObjectId | string): TokenPair => {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secret keys not defined in environment variables');
  }
  
  const userIdString = userId.toString();
  
  const accessToken = jwt.sign(
    { userId: userIdString }, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: userIdString }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export default generateTokens;
