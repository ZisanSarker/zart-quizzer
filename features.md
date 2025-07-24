# ZART Quizzer Features

This document outlines the features of the ZART Quizzer application, organized by page.

## Main Pages

### Home Page (`/`)

- **Landing Page:** Provides a brief introduction to the application and its features.
- **Navigation:** Contains links to the login, register, and explore pages.
- **Featured Quizzes:** Displays a selection of public quizzes to showcase the application's content.

### Login Page (`/login`)

- **Email/Password Login:** Allows users to log in with their registered email and password.
- **Social Login:** Provides options for users to log in with their Google, GitHub, or Facebook accounts.
- **Navigation:** Includes links to the registration page and a "Forgot Password" feature.

### Register Page (`/register`)

- **User Registration:** Allows new users to create an account by providing a username, email, and password.
- **Navigation:** Includes a link to the login page for existing users.

### Explore Page (`/explore`)

- **Public Quizzes:** Displays a list of all public quizzes created by users.
- **Search and Filter:** Allows users to search for quizzes by topic and filter them by difficulty level.
- **Quiz Practice:** Users can select any public quiz to practice.

## Dashboard Pages

### Dashboard (`/dashboard`)

- **User Statistics:** Displays key statistics for the logged-in user, including the number of quizzes created, quizzes completed, average score, and total time spent.
- **Recent Quizzes:** Shows a list of the user's most recently completed quizzes, along with their scores.
- **Recommended Quizzes:** Provides a list of recommended quizzes based on the user's activity and interests.
- **Create Quiz:** Includes a prominent button to navigate to the quiz creation page.

### Create Quiz Page (`/dashboard/create`)

- **AI-Powered Quiz Generation:** Allows users to generate quizzes on any topic using AI.
- **Manual Input:** Provides a form for users to manually input quiz details, including the topic, description, quiz type (multiple-choice, true/false, or mixed), number of questions, difficulty level, and time limit.
- **Voice Commands:** Features a voice command option to automatically fill out the quiz creation form.
- **Public/Private:** Allows users to set their quizzes as public or private.

### Quiz Preview Page (`/dashboard/quiz/preview/:id`)

- **Quiz Details:** Displays the details of a quiz before the user starts practicing it, including the topic, description, and number of questions.
- **Start Quiz:** Includes a button to start practicing the quiz.
- **Share Quiz:** Provides an option to share the quiz with others if it is public.

### Practice Quiz Page (`/dashboard/quiz/practice/:id`)

- **Interactive Interface:** Provides an interactive interface for taking quizzes.
- **Question Display:** Displays one question at a time with its options.
- **Progress Tracking:** Shows the user's progress through the quiz (e.g., "Question 3 of 10").
- **Timer:** Includes a timer for each question if the time limit is enabled.
- **Navigation:** Allows users to move between the previous and next questions.
- **Submission:** Includes a button to submit the quiz once all questions have been answered.

### Quiz Result Page (`/dashboard/quiz/result/:id`)

- **Score Display:** Shows the user's final score after submitting a quiz.
- **Question Breakdown:** Provides a detailed breakdown of each question, including the user's answer, the correct answer, and an explanation.
- **Retake Quiz:** Includes an option to retake the quiz.

### History Page (`/dashboard/history`)

- **Quiz Attempts:** Lists all the quizzes the user has attempted.
- **Attempt Details:** For each attempt, it displays the quiz topic, date of completion, and score.
- **View Results:** Includes a link to view the detailed results of each attempt.

### Library Page (`/dashboard/library`)

- **User Quizzes:** Displays a list of all the quizzes created by the user.
- **Saved Quizzes:** Shows a list of all the quizzes the user has saved.
- **Quiz Management:** Allows users to manage their quizzes, including editing, deleting, and sharing them.

### Profile Page (`/dashboard/profile`)

- **User Information:** Displays the user's profile information, including their username, email, bio, and social links.
- **Profile Editing:** Allows users to edit their profile information.
- **Badges and Statistics:** Shows the user's earned badges and statistics.

### Settings Page (`/dashboard/settings`)

- **Account Management:** Provides options for managing the user's account.
- **Change Password:** Allows users to change their password.
- **Delete Account:** Includes an option for users to delete their account.
