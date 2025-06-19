const Quiz = require('../models/quiz.model');
const QuizPrompt = require('../models/quizPrompt.model');
const QuizAttempt = require('../models/quizAttempt.model');
const moment = require('moment');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Helper: Format AI prompt
const buildPrompt = (topic, difficulty, count) => `
Generate ${count} ${difficulty} level multiple choice quiz questions on the topic "${topic}". 
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

exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = 'medium', numberOfQuestions = 5 } = req.body;

    const prompt = await QuizPrompt.create({
      topic,
      difficulty,
      numberOfQuestions,
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(
      buildPrompt(topic, difficulty, numberOfQuestions)
    );
    const response = await result.response;
    const text = response.text();

    let questions;
    try {
      // Attempt to parse JSON from the AI response
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      const jsonText = text.slice(start, end + 1);
      questions = JSON.parse(jsonText);
    } catch (jsonErr) {
      return res.status(500).json({
        message: 'Failed to parse Gemini response',
        error: jsonErr.message,
      });
    }

    const quiz = await Quiz.create({
      topic,
      difficulty,
      questions,
      promptRef: prompt._id,
    });
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Quiz generation failed', error: err.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving quiz' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, userId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    const resultAnswers = [];

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
    });

    res.status(201).json({
      message: 'Quiz submitted',
      score,
      total: quiz.questions.length,
      result: resultAnswers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};

exports.getRecentQuizAttempts = async (req, res) => {
  try {
    if (!req.userId) {
      return res
        .status(400)
        .json({ message: 'User ID not found. Authentication failed.' });
    }

    const attempts = await QuizAttempt.find({ userId: req.userId })
      .sort({ submittedAt: -1 })
      .populate('quizId');

    if (attempts.length === 0) {
      return res
        .status(404)
        .json({ message: 'No quiz attempts found for this user.' });
    }

    const recentQuizzes = attempts
      .filter((attempt) => attempt.quizId)
      .map((attempt) => {
        const quiz = attempt.quizId;
        const totalQuestions = quiz.questions.length;
        const correctAnswers = parseFloat(attempt.score.toFixed(2));
        const percentage = ((attempt.score / totalQuestions) * 100).toFixed(0);
        const timeTaken = attempt.timeTaken || 'N/A';
        const completedAt = attempt.submittedAt.toISOString();

        return {
          // original fields
          id: attempt._id,
          title: `${quiz.topic} - ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}`,
          score: percentage,
          date: moment(attempt.submittedAt).fromNow(),

          // additional fields
          quizId: quiz._id,
          quizTitle: `${quiz.topic} - ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}`,
          totalQuestions,
          correctAnswers,
          timeTaken,
          completedAt,
        };
      });

    res.status(200).json(recentQuizzes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Failed to fetch recent quizzes', error: err.message });
  }
};


exports.getRecommendedQuizzes = async (req, res) => {
  try {
    // Helper function to map quiz data
    const mapQuizData = (quiz) => {
      return {
        id: quiz._id,
        title: `${quiz.topic} - ${quiz.questions[0]?.questionText || 'Untitled'}`, // Use first question's text as title
        author: quiz.createdBy ? quiz.createdBy.name : 'Unknown', // Assuming createdBy is a reference to a user
        difficulty:
          quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1), // Capitalize the difficulty
      };
    };

    // Fetch the quizzes from the database
    const quizzes = await Quiz.find()
      .sort({ createdAt: -1 }) // Or any other logic to get recommendations
      .limit(10) // Limit to top 10 for recommendation
      .populate('createdBy', 'name'); // Assuming 'createdBy' is a reference to the User model

    // Map quizzes to the desired format
    const recommendedQuizzes = quizzes.map(mapQuizData);

    // Return the recommended quizzes
    res.status(200).json(recommendedQuizzes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: 'Failed to fetch recommended quizzes',
        error: err.message,
      });
  }
};
