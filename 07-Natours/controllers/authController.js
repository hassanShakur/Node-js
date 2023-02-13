const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendTokenResponse = (userId, statusCode, res) => {
  const token = signToken(userId);

  res.status(statusCode).json({
    status: 'success',
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    ...req.body,
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,
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
  sendTokenResponse(user._id, 200, res);
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

exports.restrictTo = (...roles) => {
  // Roles can be an array of permitted users/roles
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not aythorized to perform this operation!!!', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Check if user exists using email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with that email!!', 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send url to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `We've received a password reset request. Please submit a PATCH request to ${resetURL} with the new password and confirm password.\nIf you didn't forget your password just ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password reset token, (valid for 10 mins)`,
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Check your email for the token!',
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);
    return next(
      new AppError('Something went wrong! Please try again later.', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Token hasnt expired and there is a user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  // Update passwordChangedAt property

  // Log user in and send jwt token
  sendTokenResponse(user._id, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Find user based on passed id and user from protect middleware
  //? Should Never Use FindByIdAndUpdate as it doesnt run Validatiors
  //? Validators only run on SAVE and NEW doc
  const user = await User.findById(req.user.id).select('+password');
  // console.log(user);

  // Check if POSTed pass is correct
  const correct = await user.correctPassword(
    req.body.passwordCurrent,
    user.password
  );

  if (!correct) {
    return next(new AppError('Wrong password!', 401));
  }

  // Save new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Send token
  sendTokenResponse(user._id, 200, res);
});
