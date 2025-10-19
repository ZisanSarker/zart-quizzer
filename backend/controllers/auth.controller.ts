/// <reference path="../types/express.d.ts" />
import { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import generateTokens from '../utils/generateTokens';
import { hashPassword, comparePassword, sanitizeUser } from '../utils/userUtils';
import validator from 'validator';
import passport from '../config/passport';
import { LoginRequestBody, RegisterRequestBody } from '../types';

const cookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge,
  path: '/',
});

const validateRegistration = (username?: string, email?: string, password?: string) => {
  if (!username || !email || !password) {
    return { valid: false, message: 'Please fill in all required fields' } as const;
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Please enter a valid email address' } as const;
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' } as const;
  }

  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must include at least one number' } as const;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must include at least one special character' } as const;
  }

  return { valid: true } as const;
};

const validateLogin = (email?: string, password?: string) => {
  if (!email || !password) {
    return { valid: false, message: 'Please enter both email and password' } as const;
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Please enter a valid email address' } as const;
  }

  return { valid: true } as const;
};

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const validation = validateRegistration(username, email, password);
    if (!validation.valid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'An account with this email already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      passwordChangedAt: new Date(Date.now() - 1000)
    });
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    console.log(`[AUTH] User registered: ${email} (ID: ${newUser._id})`);

    res.status(201).json({
      message: 'Account created successfully! Welcome aboard!',
      user: sanitizeUser(newUser as any),
      accessToken,
      refreshToken
    });
    return;
  } catch (error: any) {
    console.error(`[AUTH] Registration error: ${error.message}`);
    res.status(500).json({ message: 'Unable to create account. Please try again.' });
    return;
  }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin(email, password);
    if (!validation.valid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const user: any = await User.findOne({ email }).select('+password');
    
    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    console.log(`[AUTH] User logged in: ${email} (ID: ${user._id})`);

    res.status(200).json({
      message: 'Welcome back! You have been logged in successfully.',
      user: sanitizeUser(user),
      accessToken,
      refreshToken
    });
    return;
  } catch (error: any) {
    console.error(`[AUTH] Login error: ${error.message}`);
    res.status(500).json({ message: 'Unable to log in. Please try again.' });
    return;
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    } as const;
    res.clearCookie('accessToken', clearOptions as any);
    res.clearCookie('refreshToken', clearOptions as any);

    (req as any).logout((error: any) => {
      if (error) {
        console.error(`[AUTH] Logout error: ${error.message}`);
        res.status(500).json({ message: 'Unable to log out. Please try again.' });
        return;
      }

      const userInfo = (req.user as any)?.email || 'anonymous';
      console.log(`[AUTH] User logged out: ${userInfo}`);

      res.status(200).json({ message: 'You have been logged out successfully.' });
      return;
    });
  } catch (error: any) {
    console.error(`[AUTH] Logout error: ${error.message}`);
    res.status(500).json({ message: 'Unable to log out. Please try again.' });
    return;
  }
};

export const refreshToken = (req: Request, res: Response): void => {
  try {
    const refreshTokenFromClient = req.cookies?.refreshToken as string | undefined;

    if (!refreshTokenFromClient) {
      res.status(403).json({ message: 'Session expired. Please log in again.' });
      return;
    }

    const decoded = jwt.verify(refreshTokenFromClient, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
    const { accessToken, refreshToken } = generateTokens(decoded.userId);

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    console.log(`[AUTH] Tokens refreshed for user: ${decoded.userId}`);

    res.status(200).json({ message: 'Session refreshed successfully.' });
    return;
  } catch (error: any) {
    console.error(`[AUTH] Token refresh error: ${error.message}`);
    res.status(403).json({ message: 'Session expired. Please log in again.' });
    return;
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User account not found.' });
      return;
    }

    res.status(200).json({ user });
    return;
  } catch (error: any) {
    console.error(`[AUTH] Get current user error: ${error.message}`);
    res.status(500).json({ message: 'Unable to retrieve user information.' });
    return;
  }
};

export const startGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const handleGoogleCallback = [
  passport.authenticate('google', {
    failureRedirect: '/login',
  }) as any,
  async (req: Request, res: Response) => {
    try {
      const user: any = req.user as any;
      user.lastLogin = new Date();
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user._id);
      res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
      res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

      console.log(`[AUTH] Google OAuth login: ${user.email} (ID: ${user._id})`);

      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error(`[AUTH] Google OAuth error: ${error.message}`);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
];

export const startGithubAuth = passport.authenticate('github', {
  scope: ['user:email'],
});

export const handleGithubCallback = [
  passport.authenticate('github', {
    failureRedirect: '/login',
  }) as any,
  async (req: Request, res: Response) => {
    try {
      const user: any = req.user as any;
      user.lastLogin = new Date();
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user._id);
      res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
      res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

      console.log(`[AUTH] GitHub OAuth login: ${user.email} (ID: ${user._id})`);

      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error(`[AUTH] GitHub OAuth error: ${error.message}`);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  },
];
