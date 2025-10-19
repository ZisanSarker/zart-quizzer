"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_session_1 = __importDefault(require("express-session"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const quiz_public_routes_1 = __importDefault(require("./routes/quiz-public.routes"));
const rating_routes_1 = __importDefault(require("./routes/rating.routes"));
const statistics_routes_1 = __importDefault(require("./routes/statistics.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const passport_1 = __importDefault(require("./config/passport"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth.middleware"));
require("colors");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    handler: (_req, res) => {
        res.status(429).json({
            message: 'Too many authentication attempts, please try again later.',
            retryAfter: Math.ceil(15 * 60 / 1000)
        });
    }
});
const apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { message: 'Too many API requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (_req, res) => {
        res.status(429).json({
            message: 'Too many API requests, please try again later.',
            retryAfter: Math.ceil(15 * 60 / 1000)
        });
    }
});
app.use('/api/auth', authRateLimiter);
app.use('/api', apiRateLimiter);
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    name: 'sessionId'
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/quizzes/public', quiz_public_routes_1.default);
app.use('/api/quizzes', auth_middleware_1.default, quiz_routes_1.default);
app.use('/api/ratings', rating_routes_1.default);
app.use('/api/statistics', auth_middleware_1.default, statistics_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/settings', auth_middleware_1.default, settings_routes_1.default);
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.get('/', (_req, res) => {
    res.json({
        message: 'Zart Quizzer API',
        version: '1.0.0',
        status: 'running'
    });
});
app.use((err, _req, res, _next) => {
    console.error(`Server Error: ${err.message}`.red.bold);
    res.status(500).json({
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : null,
    });
});
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`.bgGreen.black);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`.cyan);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};
startServer();
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});
//# sourceMappingURL=server.js.map