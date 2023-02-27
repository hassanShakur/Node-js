const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterBody = (obj, ...requiredFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (requiredFields.includes(el)) filteredObj[el] = obj[el];
  });
  return filteredObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: { user },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined!!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined!!',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined!!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined!!',
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
