# Zart Quizzer Documentation

## Problem Statement

An AI-powered quiz generation and practice platform.

## Project Overview

Zart Quizzer is a full-stack web application that allows users to generate quizzes on various topics using AI, practice them, and track their progress. The application features a user-friendly interface, authentication, and a comprehensive set of features for a seamless quiz-taking experience.

## Technologies Used

### Backend

*   **Node.js:** A JavaScript runtime environment for building server-side applications.
*   **Express:** A fast, unopinionated, and minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL database for storing application data.
*   **Mongoose:** An object data modeling (ODM) library for MongoDB and Node.js.
*   **Passport.js:** An authentication middleware for Node.js, with strategies for Google, GitHub, and Facebook.
*   **JSON Web Tokens (JWT):** A compact, URL-safe means of representing claims to be transferred between two parties.
*   **Bcrypt.js:** A library for hashing passwords.
*   **Validator.js:** A library of string validators and sanitizers.

### Frontend

*   **Next.js:** A React framework for building server-side rendered and static web applications.
*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **Shadcn/ui:** A collection of re-usable components built using Radix UI and Tailwind CSS.
*   **Framer Motion:** A library for creating animations in React.
*   **Axios:** A promise-based HTTP client for the browser and Node.js.
*   **Zod:** A TypeScript-first schema declaration and validation library.

## Features

*   **AI-Powered Quiz Generation:** Users can generate quizzes on any topic by providing a prompt.
*   **Multiple Quiz Types:** The application supports multiple-choice, true/false, and mixed-type quizzes.
*   **User Authentication:** Users can sign up and log in using their email and password, or with their Google, GitHub, or Facebook accounts.
*   **Dashboard:** A personalized dashboard for each user, displaying their statistics, recent quizzes, and recommended quizzes.
*   **Quiz Practice:** A dedicated interface for practicing quizzes, with a timer and progress tracking.
*   **Quiz History:** Users can view their past quiz attempts and their scores.
*   **Public and Private Quizzes:** Users can choose to make their quizzes public or private.
*   **Quiz Sharing:** Users can share their quizzes with others.
*   **Responsive Design:** The application is fully responsive and works on all devices.

## Architecture

The application follows a client-server architecture, with a separate backend and frontend.

### Backend

The backend is a Node.js and Express application that exposes a RESTful API for the frontend to consume. It handles user authentication, quiz generation, and data storage. The backend uses MongoDB as its database and Mongoose as its ODM.

### Frontend

The frontend is a Next.js and React application that provides a user-friendly interface for interacting with the application. It uses Tailwind CSS for styling and Shadcn/ui for its component library. The frontend communicates with the backend using the Axios HTTP client.

## Backend API

The backend API is documented below.

### Authentication

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in a user.
*   `POST /api/auth/refresh-token`: Refresh a user's access token.
*   `GET /api/auth/logout`: Log out a user.
*   `GET /api/auth/me`: Get the current user's information.
*   `GET /api/auth/google`: Redirect to Google for authentication.
*   `GET /api/auth/google/callback`: Handle the Google authentication callback.
*   `GET /api/auth/github`: Redirect to GitHub for authentication.
*   `GET /api/auth/github/callback`: Handle the GitHub authentication callback.
*   `GET /api/auth/facebook`: Redirect to Facebook for authentication.
*   `GET /api/auth/facebook/callback`: Handle the Facebook authentication callback.

### Profile

*   `GET /api/profile/me`: Get the current user's profile.
*   `PUT /api/profile/me`: Update the current user's profile.

### Quiz

*   `POST /api/quiz/generate`: Generate a new quiz.
*   `GET /api/quiz/recent`: Get the current user's recent quiz attempts.
*   `GET /api/quiz/recommended`: Get recommended quizzes for the current user.
*   `GET /api/quiz/saved`: Get the current user's saved quizzes.
*   `GET /api/quiz/explore`: Get public quizzes.
*   `GET /api/quiz/user/:userId`: Get a user's quizzes.
*   `POST /api/quiz/submit`: Submit a quiz.
*   `POST /api/quiz/save`: Save a quiz.
*   `POST /api/quiz/unsave`: Unsave a quiz.
*   `POST /api/quiz/rate`: Rate a quiz.
*   `GET /api/quiz/:id/ratings`: Get the ratings for a quiz.
*   `GET /api/quiz/quiz-attempts/:id`: Get a quiz attempt by its ID.
*   `GET /api/quiz/:id`: Get a quiz by its ID.

### Settings

*   `DELETE /api/settings/deleteAccount`: Delete the current user's account.
*   `POST /api/settings/change-password`: Change the current user's password.

### Statistics

*   `GET /api/statistics/me`: Get the current user's statistics.
*   `GET /api/statistics/:userId`: Get a user's statistics.

## Frontend

The frontend is organized into pages and components.

### Pages

*   `/`: The home page.
*   `/login`: The login page.
*   `/register`: The register page.
*   `/dashboard`: The user's dashboard.
*   `/dashboard/create`: The page for creating a new quiz.
*   `/dashboard/history`: The page for viewing the user's quiz history.
*   `/dashboard/library`: The page for viewing the user's saved quizzes.
*   `/dashboard/profile`: The page for viewing and editing the user's profile.
*   `/dashboard/quiz/practice/:id`: The page for practicing a quiz.
*   `/dashboard/quiz/preview/:id`: The page for previewing a quiz.
*   `/dashboard/quiz/result/:id`: The page for viewing the results of a quiz.
*   `/dashboard/settings`: The page for managing the user's account settings.
*   `/explore`: The page for exploring public quizzes.

### Components

The frontend uses a variety of reusable components, including:

*   `DashboardLayout`: The layout for the dashboard pages.
*   `HomeLayout`: The layout for the home page.
*   `PageContainer`: A container for the content of each page.
*   `PageHeader`: The header for each page.
*   `Providers`: A component that provides the necessary context for the application.
*   `ResponsiveGrid`: A responsive grid component.
*   `Section`: A section component.
*   `ThemeProvider`: A component that provides the theme for the application.
*   A variety of UI components from Shadcn/ui.

## Getting Started

To get started with the project, follow these steps:

1.  Clone the repository.
2.  Install the dependencies for the backend and frontend.
3.  Create a `.env` file in the backend directory and add the necessary environment variables.
4.  Start the backend server.
5.  Start the frontend server.

