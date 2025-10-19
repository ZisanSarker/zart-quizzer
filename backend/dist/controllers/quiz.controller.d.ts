import { Request, Response } from 'express';
export declare const generateQuiz: (req: Request, res: Response) => Promise<void>;
export declare const getAllQuizzes: (_req: Request, res: Response) => Promise<void>;
export declare const getQuizById: (req: Request, res: Response) => Promise<void>;
export declare const submitQuiz: (req: Request, res: Response) => Promise<void>;
export declare const getQuizAttemptById: (req: Request, res: Response) => Promise<void>;
export declare const getRecentQuizAttempts: (req: Request, res: Response) => Promise<void>;
export declare const getRecommendedQuizzes: (req: Request, res: Response) => Promise<void>;
export declare const getSavedQuizzes: (req: Request, res: Response) => Promise<void>;
export declare const getUserQuizzes: (req: Request, res: Response) => Promise<void>;
export declare const getPublicQuizzes: (req: Request, res: Response) => Promise<void>;
export declare const saveQuiz: (req: Request, res: Response) => Promise<void>;
export declare const unsaveQuiz: (req: Request, res: Response) => Promise<void>;
export declare const getQuizRatings: (req: Request, res: Response) => Promise<void>;
export declare const getTrendingQuizzes: (req: Request, res: Response) => Promise<void>;
export declare const getPopularSearchQueries: (_req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=quiz.controller.d.ts.map