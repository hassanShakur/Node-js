// eslint-disable-next-line prettier/prettier
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const userRouter = require('./routers/userRouters');
const tourRouter = require('./routers/tourRouters');

// Global Middlewares
// Set securuty headers
app.use(helmet());

// Limiting IP requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in 1 hour!',
});

app.use('/api', limiter);

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser - Reading data from body to req.body, can limit max size of body received
// app.use(express.json());
app.use(express.json({ limit: '10kb' }));

// Protection from NoSQL and query injections
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serve static files
app.use(express.static(`${__dirname}/public`));

// Test Middleware
app.use((req, res, next) => {
  req.timeRequested = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Router mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unhandled routes
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `The url ${req.originalUrl} couldnt be found on server!!!`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
