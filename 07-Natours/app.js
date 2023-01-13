const express = require('express');
const morgan = require('morgan');

const app = express();

const userRouter = require('./routers/userRouters');
const tourRouter = require('./routers/tourRouters');

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Middleware called 👋');
  req.timeRequested = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(3000, () => {
  console.log('App running on port 3000...');
});
