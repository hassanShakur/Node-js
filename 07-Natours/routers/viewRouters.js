const express = require('express');
const { getTour, getOverview } = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOverview);
router.get('/tour', getTour);

module.exports = router;
