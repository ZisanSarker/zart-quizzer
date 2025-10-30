const { ValidationError } = require('../errors');

const validateQuizGeneration = (data) => {
  const { topic, difficulty, numberOfQuestions, quizType } = data;

  if (!topic || topic.trim().length === 0) {
    throw new ValidationError('Topic is required');
  }

  const validDifficulties = ['easy', 'medium', 'hard'];
  if (difficulty && !validDifficulties.includes(difficulty)) {
    throw new ValidationError('Invalid difficulty level');
  }

  if (numberOfQuestions && (numberOfQuestions < 1 || numberOfQuestions > 50)) {
    throw new ValidationError('Number of questions must be between 1 and 50');
  }

  const validQuizTypes = ['multiple-choice', 'true-false', 'mixed'];
  if (quizType && !validQuizTypes.includes(quizType)) {
    throw new ValidationError('Invalid quiz type');
  }
};

const validateQuizSubmission = (data) => {
  const { quizId, answers } = data;

  if (!quizId) {
    throw new ValidationError('Quiz ID is required');
  }

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    throw new ValidationError('Answers array is required');
  }
};

const validateRating = (rating) => {
  if (!rating || rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5');
  }
};

module.exports = {
  validateQuizGeneration,
  validateQuizSubmission,
  validateRating,
};

