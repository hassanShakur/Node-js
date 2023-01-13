const express = require('express');

const userControllers = require('../controllers/userControllers');
const { getAllUsers, createUser, getUser, updateUser, deleteUser } =
  userControllers;

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
