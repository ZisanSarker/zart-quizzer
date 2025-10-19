import bcrypt from 'bcryptjs';
import { IUser, AuthProvider, PublicUser } from '../types';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export const getAuthProvider = (user: IUser): AuthProvider => {
  if (user.googleId) return 'google';
  if (user.githubId) return 'github';
  return 'local';
};

export const sanitizeUser = (user: IUser): PublicUser => {
  const obj: any = user.toJSON ? user.toJSON() : (user as any).toObject?.() ?? user;
  const provider = getAuthProvider(user);
  const sanitized: PublicUser = {
    _id: String(obj._id),
    username: obj.username,
    email: obj.email,
    profilePicture: obj.profilePicture,
    role: obj.role,
    isActive: obj.isActive,
    isEmailVerified: obj.isEmailVerified,
    lastLogin: obj.lastLogin ? new Date(obj.lastLogin).toISOString() : null,
    createdAt: new Date(obj.createdAt).toISOString(),
    updatedAt: new Date(obj.updatedAt).toISOString(),
    provider,
  };
  return sanitized;
};
