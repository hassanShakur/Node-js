// eslint-disable-next-line prettier/prettier
const express = require('express');
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const userRouter = require('./routers/userRouters');
const tourRouter = require('./routers/tourRouters');

// Global Middlewares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in 1 hour!',
});

app.use('/api', limiter);

app.use((req, res, next) => {
  // console.log('Middleware called');
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
