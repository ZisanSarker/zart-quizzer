const Quiz = require('../models/quiz.model');
const QuizPrompt = require('../models/quizPrompt.model');
const QuizAttempt = require('../models/quizAttempt.model');

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

    const prompt = await QuizPrompt.create({ topic, difficulty, numberOfQuestions });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(buildPrompt(topic, difficulty, numberOfQuestions));
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
      return res.status(500).json({ message: 'Failed to parse Gemini response', error: jsonErr.message });
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
    res.status(500).json({ message: 'Quiz generation failed', error: err.message });
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
          explanation: question.explanation
        });
      }
  
      const attempt = await QuizAttempt.create({
        userId,
        quizId,
        answers: resultAnswers,
        score
      });
  
      res.status(201).json({
        message: 'Quiz submitted',
        score,
        total: quiz.questions.length,
        result: resultAnswers
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to submit quiz' });
    }
  };
  