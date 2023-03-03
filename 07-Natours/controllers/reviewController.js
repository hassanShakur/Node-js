const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const Tour = require('./../models/tourModel');

exports.setTourUserIds = (req, res, next) => {
  // For nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
