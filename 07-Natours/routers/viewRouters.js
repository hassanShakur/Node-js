const express = require('express');
const { getTour, getOverview } = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOverview);
router.get('/tours/:tourSlug', getTour);

module.exports = router;
