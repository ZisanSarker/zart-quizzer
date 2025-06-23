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
const statisticsRoutes = require('./routes/statistics.routes');
const profileRoutes = require('./routes/profile.routes');
const passport = require('./config/passport');
const authMiddleware = require('./middlewares/auth.middleware');
require('colors');

dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
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
app.use('/api/statistics', authMiddleware, statisticsRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);

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