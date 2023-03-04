const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // Get all tours
  const tours = await Tour.find();

  // Create template

  // Render fetched tours
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  let query = Tour.findOne({ slug: req.params.tourSlug });
  query.populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  const tour = await query;

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
