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
const passport = require('./config/passport');
const authMiddleware = require('./middlewares/auth.middleware');
require('colors');

dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', 1); // <<-- REQUIRED for production cookie/session auth!

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

app.use(cors({
  origin: "https://zart-quizzer.vercel.app",
  credentials: true
}));

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please try again later.',
});
app.use('/api/auth', authRateLimiter);

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

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', authMiddleware, quizRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use((err, req, res, next) => {
  console.error(`Server Error: ${err.message}`.red.bold);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : null,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`.bgGreen.black);
});