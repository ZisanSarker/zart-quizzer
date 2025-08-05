import api from "./api"
import type {
  Quiz,
  QuizSubmission,
  QuizResult,
  RecentQuizAttempt,
  RecommendedQuiz,
  QuizAttemptResult,
  ExploreQuiz,
} from "@/types/quiz"

export interface GenerateQuizData {
  topic: string
  description?: string
  quizType: "multiple-choice" | "true-false" | "mixed"
  numberOfQuestions?: number
  difficulty?: "easy" | "medium" | "hard"
  isPublic?: boolean
  timeLimit: boolean
}

export interface GenerateQuizResponse {
  message: string
  quiz: Quiz
}

export const generateQuiz = async (data: GenerateQuizData): Promise<GenerateQuizResponse> => {
  const response = await api.post<GenerateQuizResponse>("/quizzes/generate", data)
  return response.data
}

export const getRecentQuizAttempts = async (): Promise<RecentQuizAttempt[]> => {
  try {
    const response = await api.get<RecentQuizAttempt[]>("/quizzes/recent")
    return response.data
  } catch (error) {
    console.error('Failed to fetch recent quiz attempts:', error)
    return []
  }
}

export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await api.get<Quiz>(`/quizzes/public/${id}`)
  return response.data
}

export const submitQuiz = async (data: QuizSubmission): Promise<QuizResult> => {
  const response = await api.post<QuizResult>("/quizzes/submit", data)
  return response.data
}

export const getUserQuizzes = async (userId: string): Promise<Quiz[]> => {
  const response = await api.get<Quiz[]>(`/quizzes/user/${userId}`)
  return response.data
}

export const getRecommendedQuizzes = async (): Promise<RecommendedQuiz[]> => {
  try {
    const response = await api.get<RecommendedQuiz[]>("/quizzes/recommended")
    return response.data
  } catch (error) {
    console.error('Failed to fetch recommended quizzes:', error)
    return []
  }
}

export const getSavedQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await api.get<Quiz[]>("/quizzes/saved");
    return response.data;
  } catch (error) {
    console.error('Failed to fetch saved quizzes:', error)
    return []
  }
}

export const getQuizResultByAttemptId = async (attemptId: string): Promise<QuizAttemptResult> => {
  const response = await api.get<QuizAttemptResult>(`/quizzes/quiz-attempts/${attemptId}`);
  return response.data;
}

export interface ExploreQuizzesParams {
  search?: string;
  category?: string;
  difficulty?: string;
  sort?: 'popular' | 'recent' | 'trending';
}

export const getExploreQuizzes = async (params?: ExploreQuizzesParams): Promise<ExploreQuiz[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const response = await api.get<ExploreQuiz[]>(`/quizzes/public/explore?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch explore quizzes:', error)
    return []
  }
};

export const saveQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/quizzes/save", { quizId });
  return response.data;
};

export interface PopularSearchQuery {
  query: string;
  count: number;
}

export const getPopularSearchQueries = async (limit: number = 10): Promise<PopularSearchQuery[]> => {
  try {
    const response = await api.get<PopularSearchQuery[]>(`/quizzes/public/popular-search-queries?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch popular search queries:', error);
    return [];
  }
};

export const unsaveQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/quizzes/unsave", { quizId });
  return response.data;
};

export const getTrendingQuizzes = async (limit: number = 3): Promise<ExploreQuiz[]> => {
  try {
    const response = await api.get<ExploreQuiz[]>(`/quizzes/public/trending?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending quizzes:', error)
    return []
  }
}