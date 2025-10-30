const { AppError } = require('../errors');

const errorHandler = (err, req, res, next) => {
  console.error('Error Handler:', err);
  
  let error = err;

  if (!(error instanceof AppError)) {
    if (error.name === 'ValidationError') {
      error = new AppError(error.message, 400);
    } else if (error.name === 'CastError') {
      error = new AppError('Invalid resource ID', 400);
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)?.[0] || 'field';
      error = new AppError(`${field} already exists`, 409);
    } else if (error.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token', 401);
    } else if (error.name === 'TokenExpiredError') {
      error = new AppError('Token expired', 401);
    } else {
      error = new AppError(
        process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
        500
      );
    }
  }

  // Ensure CORS headers are always sent, even on errors
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://192.168.0.108:3000',
    'http://192.168.1.118:3000',
  ].filter(Boolean);

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }

  res.status(error.statusCode || 500).json({
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = errorHandler;

