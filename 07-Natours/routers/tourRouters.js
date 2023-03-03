const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRouters');

const tourControllers = require('../controllers/tourControllers');

const { getAllTours, createTour, getTour, updateTour, deleteTour } =
  tourControllers;

const router = express.Router();

// router.param('id', (req, res, next, val) => {
//   console.log(`ID is ${val}`);
//   next();
// });

// router.param('id', tourControllers.checkID);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/monthly-plan/:year')
  .get(tourControllers.getMonthlyPlan, getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats, getAllTours);

router.route('/best-and-cheap').get(tourControllers.bestAndCheap, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'tour-guide'), updateTour)
  .delete(protect, restrictTo('admin'), deleteTour);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.tourWithin);

module.exports = router;
