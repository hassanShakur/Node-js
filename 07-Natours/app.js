// eslint-disable-next-line prettier/prettier
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');

const app = express();

const userRouter = require('./routers/userRouters');
const tourRouter = require('./routers/tourRouters');

// Middlewares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log('Middleware called');
  req.timeRequested = new Date().toISOString();
  next();
});

// Router mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unhandled routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `The url ${req.originalUrl} couldnt be found on server.`,
  // });
  const err = new Error(
    `The url ${req.originalUrl} couldnt be found on server!`
  );
  err.status = 'fail';
  err.statusCode = 404;
  // Any parameter passed in a middleware next() is considered and error will be passed to error handling
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //500 for internal server errors (error)
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
