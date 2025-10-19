import { Request, Response } from 'express';
import Quiz from '../models/quiz.model';
import QuizPrompt from '../models/quizPrompt.model';
import QuizAttempt from '../models/quizAttempt.model';
import SavedQuiz from '../models/savedQuiz.model';
import QuizRating from '../models/quizRating.model';
import SearchQuery from '../models/searchQuery.model';
import moment from 'moment';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

const getMultipleQuizRatings = async (quizIds: string[]) => {
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
  
  return ratingMap;
};

const buildPrompt = (topic: string, description: string | undefined, difficulty: string, count: number, quizType: 'multiple-choice' | 'true-false' | 'mixed') => {
  let base = `Generate ${count} ${difficulty} level ${quizType} quiz questions on the topic "${topic}".`;
  if (description) base += `\nDescription: ${description}`;

  if (quizType === 'true-false') {
    base += `
Each question should have:
- 1 question text
- 2 options: ["True", "False"]
- 1 correct answer ("True" or "False")
- 1 short explanation

Format the output in JSON like this:
[
  {
    "questionText": "...",
    "options": ["True", "False"],
    "correctAnswer": "...",
    "explanation": "..."
  },
  ...
]
`;
  } else if (quizType === 'multiple-choice') {
    base += `
Each question should have:
- 1 question text
- 4 options
- 1 correct answer
- 1 short explanation

Format the output in JSON like this:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": "...",
    "explanation": "..."
  },
  ...
]
`;
  } else if (quizType === 'mixed') {
    base += `
Generate a mix of both multiple-choice and true/false questions. 
For multiple-choice: 4 options, for true/false: 2 options ["True", "False"].
Each question should have:
- 1 question text
- options (either 4 for multiple-choice or 2 for true/false)
- 1 correct answer
- 1 short explanation

Format the output in JSON like this:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": "...",
    "explanation": "..."
  },
  ...
]
`;
  }
  return base;
};

export const generateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      topic,
      description,
      difficulty = 'medium',
      numberOfQuestions = 5,
      quizType = 'multiple-choice',
      isPublic = false,
      timeLimit = true,
    } = req.body as any;

    const prompt = await QuizPrompt.create({
      topic,
      description,
      difficulty,
      numberOfQuestions,
      quizType,
    });

    if (!req.user || !(req.user as any)._id) {
      res.status(401).json({ message: 'User not authenticated. Cannot create quiz.' });
      return;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(
      buildPrompt(topic, description, difficulty, numberOfQuestions, quizType)
    );
    const response = await result.response;
    const text = response.text();

    let questions: any[];
    try {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      const jsonText = text.slice(start, end + 1);
      questions = JSON.parse(jsonText);

      questions = questions.map((q: any) => ({
        ...q,
        type:
          quizType === 'mixed'
            ? (q.options && q.options.length === 2 ? 'true-false' : 'multiple-choice')
            : quizType
      }));
    } catch (jsonErr: any) {
      res.status(500).json({
        message: 'Failed to parse Gemini response',
        error: jsonErr.message,
      });
      return;
    }

    const quiz = await Quiz.create({
      topic,
      description,
      quizType,
      difficulty,
      isPublic,
      timeLimit,
      questions,
      promptRef: prompt._id,
      createdBy: (req.user as any)._id,
    });
    res.status(201).json({ message: 'Quiz created successfully', quiz });
    return;
  } catch (err: any) {
    res.status(500).json({ message: 'Quiz generation failed', error: err.message });
    return;
  }
}

export const getAllQuizzes = async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    
    const quizIds = quizzes.map(quiz => quiz._id.toString());
    const ratingsMap = await getMultipleQuizRatings(quizIds);
    
    const quizzesWithRatings = quizzes.map(quiz => ({
      ...quiz.toObject(),
      averageRating: ratingsMap[quiz._id.toString()] || 0
    }));
    
    res.status(200).json(quizzesWithRatings);
  } catch (_err) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

export const getQuizById = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) { res.status(404).json({ message: 'Quiz not found' }); return; }
    
    const ratings = await QuizRating.find({ quizId: quiz._id });
    const averageRating = ratings.length === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2));
    
    const quizWithRating = {
      ...quiz.toObject(),
      averageRating
    };
    
    res.status(200).json(quizWithRating);
    return;
  } catch (_err) {
    res.status(500).json({ message: 'Error retrieving quiz' });
    return;
  }
};

export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quizId, userId, answers, timeTaken } = req.body as { quizId: string; userId: string; answers: { _id: string; selectedAnswer: string }[]; timeTaken?: number };

    const quiz: any = await Quiz.findById(quizId);
  if (!quiz) { res.status(404).json({ message: 'Quiz not found' }); return; }

    let score = 0;
    const resultAnswers: any[] = [];

    for (const userAnswer of answers) {
      const question = quiz.questions.id(userAnswer._id);
      if (!question) continue;

      const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;

      resultAnswers.push({
        questionId: userAnswer._id,
        selectedAnswer: userAnswer.selectedAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      });
    }

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      answers: resultAnswers,
      score,
      timeTaken: typeof timeTaken === 'number' ? timeTaken : 0,
    });

    res.status(201).json({
      message: 'Quiz submitted',
      score,
      total: quiz.questions.length,
      result: resultAnswers,
      attemptId: attempt._id,
    });
    return;
  } catch (_error) {
    res.status(500).json({ message: 'Failed to submit quiz' });
    return;
  }
};

export const getQuizAttemptById = async (req: Request, res: Response): Promise<void> => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id).populate('quizId');
    if (!attempt) { res.status(404).json({ message: 'Result not found' }); return; }
    res.json(attempt);
    return;
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch result', error: err.message });
    return;
  }
};

export const getRecentQuizAttempts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?._id || req.userId;
    
    if (!userId) {
      res
        .status(400)
        .json({ message: 'User ID not found. Authentication failed.' });
      return;
    }

    const attempts: any[] = await QuizAttempt.find({ userId })
      .sort({ submittedAt: -1 })
      .populate('quizId');

    if (attempts.length === 0) {
      res.status(200).json([]);
      return;
    }

    const recentQuizzes = attempts
      .filter((attempt) => attempt.quizId)
      .map((attempt) => {
        const quiz: any = attempt.quizId;
        const totalQuestions = quiz.questions.length;
        const correctAnswers = parseFloat(attempt.score.toFixed(2));
        const percentage = ((attempt.score / totalQuestions) * 100).toFixed(0);
        const timeTaken = attempt.timeTaken || 'N/A';
        const completedAt = attempt.submittedAt.toISOString();

        return {
          id: attempt._id,
          title: `${quiz.topic} - ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}`,
          score: percentage,
          date: moment(attempt.submittedAt).fromNow(),
          quizId: quiz._id,
          quizTitle: `${quiz.topic} - ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}`,
          totalQuestions,
          correctAnswers,
          timeTaken,
          completedAt,
        };
      });
    
    res.status(200).json(recentQuizzes);
    return;
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch recent quizzes', error: err.message });
    return;
  }
};

export const getRecommendedQuizzes = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id || req.userId;

    const filter: any = {
      createdBy: { $ne: userId },
      isPublic: true,
    };

    let quizzes: any[] = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    const quizIds = quizzes.map(quiz => quiz._id.toString());
    const ratingsMap = await getMultipleQuizRatings(quizIds);

    const recommendedQuizzes = quizzes
      .map(quiz => ({
        id: quiz._id,
        title: `${quiz.topic} - ${quiz.questions[0]?.questionText || 'Untitled'}`,
        author: quiz.createdBy ? (quiz.createdBy as any).name : 'Unknown',
        difficulty: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1),
        averageRating: ratingsMap[quiz._id.toString()] || 0,
      }))
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return 0;
      })
      .slice(0, 10);

    res.status(200).json(recommendedQuizzes);
  } catch (err: any) {
    res.status(500).json({
      message: 'Failed to fetch recommended quizzes',
      error: err.message,
    });
  }
};

export const getSavedQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const saved = await SavedQuiz.find({ userId }).populate({
      path: 'quizId',
      populate: { path: 'createdBy', select: 'name' },
    });
    
    const quizzes = saved
      .map(item => item.quizId)
      .filter(Boolean) as any[];
    
    const quizIds = quizzes.map(quiz => quiz._id.toString());
    const ratingsMap = await getMultipleQuizRatings(quizIds);
    
    const quizzesWithRatings = quizzes.map(quiz => ({
      ...quiz.toObject(),
      author: quiz.createdBy?.name || 'Unknown',
      averageRating: ratingsMap[quiz._id.toString()] || 0
    }));
    
    res.status(200).json(quizzesWithRatings);
    return;
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch saved quizzes', error: err.message });
    return;
  }
};

export const getUserQuizzes = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const quizzes = await Quiz.find({ createdBy: userId });
    res.status(200).json(quizzes);
  } catch (_err) {
    res.status(500).json({ message: 'Failed to fetch user quizzes' });
  }
};

const getAttemptsAndRating = async (quizId: string) => {
  const attempts = await QuizAttempt.distinct('userId', { quizId }).then(list => list.length);
  const ratings = await QuizRating.find({ quizId });
  const rating = ratings.length === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2));
  return {
    attempts,
    rating,
    ratingCount: ratings.length
  };
};

const trackSearchQuery = async (query?: string) => {
  if (!query || query.trim().length < 2) return;
  
  const trimmedQuery = query.trim().toLowerCase();
  
  try {
    await SearchQuery.findOneAndUpdate(
      { query: trimmedQuery },
      { 
        $inc: { count: 1 },
        $set: { lastSearched: new Date() }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error tracking search query:', error);
  }
};

export const getPublicQuizzes = async (req: Request, res: Response) => {
  try {
    const { search, category, difficulty, sort = 'recent' } = req.query as any;
    
    if (search && (search as string).trim()) {
      await trackSearchQuery(search as string);
    }
    
    const filter: any = { isPublic: true };
    
    if (search && (search as string).trim()) {
      const searchRegex = new RegExp((search as string).trim(), 'i');
      filter.$or = [
        { topic: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }
    
    if (category && category !== 'All Categories') {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { topic: new RegExp(category as string, 'i') },
        { tags: new RegExp(category as string, 'i') }
      );
    }
    
    if (difficulty && difficulty !== 'All Levels') {
      const difficultyMap: Record<string, string> = {
        'Beginner': 'easy',
        'Intermediate': 'medium', 
        'Advanced': 'hard'
      };
      const backendDifficulty = difficultyMap[difficulty as string] || (difficulty as string).toLowerCase();
      filter.difficulty = backendDifficulty;
    }
    
    let sortObj: any = {};
    switch (sort) {
      case 'popular':
        sortObj = { rating: -1, attempts: -1 };
        break;
      case 'trending':
        sortObj = { attempts: -1, rating: -1 };
        break;
      case 'recent':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const quizzes: any[] = await Quiz.find(filter)
      .sort(sortObj)
      .populate({ path: 'createdBy', select: 'username profilePicture _id' });

    const mapped = await Promise.all(quizzes.map(async (q: any) => {
      const { attempts, rating, ratingCount } = await getAttemptsAndRating(q._id.toString());
      return {
        _id: q._id,
        topic: q.topic,
        description: q.description,
        quizType: q.quizType,
        difficulty: q.difficulty,
        questions: q.questions,
        isPublic: q.isPublic,
        timeLimit: q.timeLimit,
        createdAt: q.createdAt,
        tags: q.tags || [],
        attempts,
        rating,
        ratingCount,
        author: {
          name: q.createdBy?.username || 'Unknown',
          avatar: q.createdBy?.profilePicture || '',
          initials: q.createdBy?.username ? q.createdBy.username.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '',
          _id: q.createdBy?._id,
        }
      };
    }));

    res.status(200).json(mapped);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch public quizzes', error: err.message });
  }
};

export const saveQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)._id;
    const { quizId } = req.body as { quizId: string };

  if (!quizId) { res.status(400).json({ message: 'quizId is required' }); return; }

    const exists = await SavedQuiz.findOne({ userId, quizId });
  if (exists) { res.status(400).json({ message: 'Quiz already saved' }); return; }

    await SavedQuiz.create({ userId, quizId });
    res.status(201).json({ message: 'Quiz saved' });
    return;
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to save quiz', error: err.message });
    return;
  }
};

export const unsaveQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)._id;
    const { quizId } = req.body as { quizId: string };

  if (!quizId) { res.status(400).json({ message: 'quizId is required' }); return; }

    await SavedQuiz.findOneAndDelete({ userId, quizId });
    res.status(200).json({ message: 'Quiz removed from saved' });
    return;
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to remove saved quiz', error: err.message });
    return;
  }
};

export const getQuizRatings = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const userId = req.query.user === 'true' && req.user && (req.user as any)._id ? (req.user as any)._id : null;
    
    const ratingStats = await (async () => {
      const ratings = await QuizRating.find({ quizId });
      const count = ratings.length;
      const average = count === 0 ? 0 : Number((ratings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(2));
      let userRating: number | null = null;
      if (userId) {
        const userRatingDoc = await QuizRating.findOne({ quizId, userId });
        userRating = userRatingDoc ? userRatingDoc.rating : null;
      }
      return { average, count, userRating };
    })();
    
    res.status(200).json(ratingStats);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch ratings', error: err.message });
  }
};

export const getTrendingQuizzes = async (req: Request, res: Response) => {
  try {
    const { limit = 3 } = req.query as any;
    
    const trendingQuizzes: any[] = await Quiz.find({ isPublic: true })
      .sort({ attempts: -1, rating: -1 })
      .limit(parseInt(limit as string))
      .populate({ path: 'createdBy', select: 'username profilePicture _id' });

    const mapped = await Promise.all(trendingQuizzes.map(async (q: any) => {
      const { attempts, rating, ratingCount } = await getAttemptsAndRating(q._id.toString());
      return {
        _id: q._id,
        topic: q.topic,
        description: q.description,
        quizType: q.quizType,
        difficulty: q.difficulty,
        questions: q.questions,
        isPublic: q.isPublic,
        timeLimit: q.timeLimit,
        createdAt: q.createdAt,
        tags: q.tags || [],
        attempts,
        rating,
        ratingCount,
        author: {
          name: q.createdBy?.username || 'Unknown',
          avatar: q.createdBy?.profilePicture || '',
          initials: q.createdBy?.username ? q.createdBy.username.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '',
          _id: q.createdBy?._id,
        }
      };
    }));

    res.status(200).json(mapped);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch trending quizzes', error: err.message });
  }
};

export const getPopularSearchQueries = async (_req: Request, res: Response) => {
  try {
    const queries = await SearchQuery.find()
      .sort({ count: -1 })
      .limit(10)
      .select('query count');
    
    res.status(200).json(queries);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch popular search queries', error: err.message });
  }
};

