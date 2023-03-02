const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require('../controllers/authController');

const userControllers = require('../controllers/userControllers');

const { getAllUsers, createUser, getUser, updateUser, deleteUser } =
  userControllers;

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateme', protect, userControllers.updateMe);
router.get('/me', protect, userControllers.getMe, getUser);

router.delete('/deleteMe', protect, userControllers.deleteMe);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
