import { Request, Response } from 'express';
import QuizRating from '../models/quizRating.model';
import Quiz from '../models/quiz.model';

export const getRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quizId } = req.params as { quizId: string };
    const ratings = await QuizRating.find({ quizId });
    
    if (ratings.length === 0) {
      res.json({ rating: 0 });
      return;
    }
    
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = Number((totalRating / ratings.length).toFixed(2));
    
    res.json({ rating: averageRating });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching rating', error: error.message });
    return;
  }
};

export const getRatingStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quizId } = req.params as { quizId: string };
    const userId = req.userId;
    
    const ratings = await QuizRating.find({ quizId });
    const count = ratings.length;
    const average = count === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / count).toFixed(2));
    
    let userRating: number | null = null;
    if (userId) {
      const userRatingDoc = await QuizRating.findOne({ quizId, userId });
      userRating = userRatingDoc ? userRatingDoc.rating : null;
    }
    
    res.json({ average, count, userRating });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching rating stats', error: error.message });
    return;
  }
};

export const rateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quizId } = req.params as { quizId: string };
    const { rating } = req.body as { rating: number };
    const userId = req.userId as string;
    
    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }
    
    if (quiz.createdBy?.toString() === userId) {
      res.status(403).json({ message: 'You cannot rate your own quiz' });
      return;
    }
    
    if (!quiz.isPublic) {
      res.status(403).json({ message: 'You can only rate public quizzes' });
      return;
    }
    
    const ratingDoc = await QuizRating.findOneAndUpdate(
      { userId, quizId },
      { rating, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Rating updated successfully', rating: ratingDoc });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Error rating quiz', error: error.message });
    return;
  }
};

export const getMultipleQuizRatings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quizIds } = req.body as { quizIds: string[] };
    
    if (!Array.isArray(quizIds)) {
      res.status(400).json({ message: 'quizIds must be an array' });
      return;
    }
    
    const ratings = await QuizRating.find({ quizId: { $in: quizIds } });
    const ratingMap: Record<string, number> = {};
    
    quizIds.forEach(quizId => {
      ratingMap[quizId] = 0;
    });
    
    const ratingsByQuiz: Record<string, number[]> = {};
    ratings.forEach(rating => {
      const key = rating.quizId.toString();
      if (!ratingsByQuiz[key]) {
        ratingsByQuiz[key] = [];
      }
      ratingsByQuiz[key].push(rating.rating);
    });
    
    Object.keys(ratingsByQuiz).forEach(quizId => {
      const quizRatings = ratingsByQuiz[quizId];
      const average = quizRatings.reduce((sum, rating) => sum + rating, 0) / quizRatings.length;
      ratingMap[quizId] = Number(average.toFixed(2));
    });
    
    res.json({ ratings: ratingMap });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching multiple ratings', error: error.message });
    return;
  }
};
