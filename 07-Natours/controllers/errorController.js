const AppError = require('../utils/appError');

const handleDBCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming error
  } else {
    console.error('Error 💥, err');

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //500 for internal server errors (error)
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleDBCastError(error);
    sendErrorDev(error, res);
  } else {
    sendErrorProd(err, res);
  }
};
