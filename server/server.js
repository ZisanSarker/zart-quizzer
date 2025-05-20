const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
//const quizAttemptRoutes = require('./routes/quizAttempt.routes');
const passport = require('./config/passport');
const authMiddleware = require('./middlewares/auth.middleware');
require('colors');

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// ───────────── Middleware ─────────────
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

const allowedOrigins = [
  'https://zart-quizzer.vercel.app',
  'https://zart-quizzer-97d078mmx-zisan-sarkers-projects.vercel.app',
  'http://localhost:3000', // for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));



// ───────────── Rate Limiting on Auth Only ─────────────
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api/auth', authRateLimiter);

// ───────────── Session & Passport ─────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);
// ───────────── Passport ─────────────
app.use(passport.initialize());
app.use(passport.session());

// ───────────── Routes ─────────────
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', authMiddleware, quizRoutes);


app.get('/', (req, res) => {
  res.send('Hello World');
});

// ───────────── Global Error Handler ─────────────
app.use((err, req, res, next) => {
  console.error(`Server Error: ${err.message}`.red.bold);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : null,
  });
});

// ───────────── Server ─────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`.bgGreen.black);
});
