module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //500 for internal server errors (error)
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
