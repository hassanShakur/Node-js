const { promisify } = require('util');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // If details are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 404));
  }

  //? If user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // console.log(user);

  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // Everything OK
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check if token is included in header
  const auth = req.headers.authorization;
  let token;
  if (auth && auth.startsWith('Bearer')) {
    // authorization: Bearer sometokenstring
    token = auth.split(' ')[1];
  }

  if (!token) return next(new AppError('Please log in to continue', 401));
  // console.log(token);

  // Authenticity of token - Verification

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  // console.log(decoded);

  // If user still exists
  const currUser = await User.findById(decoded.id);

  if (!currUser) {
    return next(
      new AppError('The owner for this token no longer exists!!!', 401)
    );
  }

  // If user changed password after token was issued
  if (currUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User password changed recently. Please login again.')
    );
  }

  // Grant access
  req.user = currUser;
  next();
});
