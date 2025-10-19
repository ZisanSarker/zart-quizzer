import { Request } from 'express';
import { IUser } from './index';

// Extend Express Request to include user and userId
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
    }
  }
}

export {};
