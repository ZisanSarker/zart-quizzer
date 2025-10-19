import { Request, Response } from 'express';
import User from '../models/user.model';
import Profile from '../models/profile.model';
import Quiz from '../models/quiz.model';
import QuizAttempt from '../models/quizAttempt.model';
import QuizRating from '../models/quizRating.model';
import SavedQuiz from '../models/savedQuiz.model';
import Statistics from '../models/statistics.model';
import { hashPassword, comparePassword } from '../utils/userUtils';

const validatePasswordChange = (currentPassword?: string, newPassword?: string, confirmPassword?: string) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { valid: false, message: 'Please provide current and new passwords' } as const;
  }

  if (newPassword !== confirmPassword) {
    return { valid: false, message: 'New passwords do not match' } as const;
  }

  if (newPassword.length < 8) {
    return { valid: false, message: 'New password must be at least 8 characters long' } as const;
  }

  if (!/\d/.test(newPassword)) {
    return { valid: false, message: 'New password must include at least one number' } as const;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    return { valid: false, message: 'New password must include at least one special character' } as const;
  }

  return { valid: true } as const;
};

const deleteUserData = async (userId: any) => {
  await Promise.all([
    Profile.deleteMany({ userId }),
    Quiz.deleteMany({ createdBy: userId }),
    QuizAttempt.deleteMany({ userId }),
    QuizRating.deleteMany({ userId }),
    SavedQuiz.deleteMany({ userId }),
    Statistics.deleteMany({ userId })
  ]);
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)._id;
    const { currentPassword, newPassword, confirmPassword } = req.body as { currentPassword: string; newPassword: string; confirmPassword: string };

    const validation = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (!validation.valid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const user: any = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({ message: 'User account not found' });
      return;
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save();

    console.log(`[SETTINGS] Password changed for user: ${userId}`);

    res.status(200).json({ message: 'Password changed successfully' });
    return;
  } catch (error: any) {
    console.error(`[SETTINGS] Change password error: ${error.message}`);
    res.status(500).json({ message: 'Unable to change password. Please try again.' });
    return;
  }
};

export const deleteUserAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User account not found' });
      return;
    }

    await deleteUserData(userId);
    await User.findByIdAndDelete(userId);

    console.log(`[SETTINGS] Account deleted for user: ${userId}`);

    res.status(200).json({ message: 'Account and all data deleted successfully' });
    return;
  } catch (error: any) {
    console.error(`[SETTINGS] Delete account error: ${error.message}`);
    res.status(500).json({ message: 'Unable to delete account. Please try again.' });
    return;
  }
};
