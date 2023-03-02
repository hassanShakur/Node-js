const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');

const userControllers = require('../controllers/userControllers');

const { getAllUsers, createUser, getUser, updateUser, deleteUser } =
  userControllers;

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//Protect all routes after this by using protect in middleware as middlewares run in sequence.
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.patch('/updateme', userControllers.updateMe);
router.get('/me', userControllers.getMe, getUser);
router.delete('/deleteMe', userControllers.deleteMe);

// Restrict routes after this
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
