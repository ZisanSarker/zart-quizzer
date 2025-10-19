import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import { JWTDecoded } from '../types';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof (req as any).isAuthenticated === 'function' && (req as any).isAuthenticated()) {
      req.userId = (req.user as any)?._id?.toString() || (req.user as any)?.id;
      return next();
    }

    const accessToken = req.cookies?.accessToken as string | undefined;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.split(' ')[1];
    const token = accessToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JWTDecoded;
      req.userId = decoded.userId;
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user as any;
      return next();
    } catch (_tokenError) {
      const refreshTokenCookie = req.cookies?.refreshToken as string | undefined;
      const refreshTokenHeader = authHeader?.split(' ')[2];
      const refreshToken = refreshTokenHeader || refreshTokenCookie;

      if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token required.' });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JWTDecoded;
        req.userId = decodedRefresh.userId;
        const user = await User.findById(decodedRefresh.userId);
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user as any;

        const newAccessToken = jwt.sign(
          { userId: req.userId },
          process.env.JWT_ACCESS_SECRET as string,
          { expiresIn: '15m' }
        );

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        });

        return next();
      } catch (_refreshTokenError) {
        return res.status(403).json({ message: 'Invalid refresh token. Authentication required.' });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

export default authMiddleware;
