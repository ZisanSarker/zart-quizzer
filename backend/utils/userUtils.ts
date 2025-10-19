import bcrypt from 'bcryptjs';
import { IUser, AuthProvider } from '../types';

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

export const sanitizeUser = (user: IUser): Partial<IUser> => {
  const userObj = user.toJSON ? user.toJSON() : user.toObject();
  delete userObj.password;
  delete userObj.passwordChangedAt;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  delete userObj.__v;
  return userObj;
};
