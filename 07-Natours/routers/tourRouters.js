const express = require('express');

const tourControllers = require('../controllers/tourControllers');
const { getAllTours, createTour, getTour, updateTour, deleteTour } =
  tourControllers;

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
