const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterBody = (obj, ...requiredFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (requiredFields.includes(el)) filteredObj[el] = obj[el];
  });
  return filteredObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined! Please use Signup to create account!',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // Send error if user is tryng to change password
  if (req.body.password || req.body.passwordconfirm) {
    return next(
      new AppError('Please use /updateMyPassword for password update!', 400)
    );
  }

  // select only fields user is allowed to change
  const filteredBody = filterBody(req.body, 'name', 'email');
  console.log(filterBody);

  // Use direct update as password will be required if you try to save
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
