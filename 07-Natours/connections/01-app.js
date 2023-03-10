// eslint-disable-next-line prettier/prettier
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');

const app = express();

const userRouter = require('../routers/userRouters');
const tourRouter = require('../routers/tourRouters');

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

module.exports = app;
