const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
  },

  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    unique: [true, 'This email is already in use.'],
    validate: [validator.isEmail, 'Please enter a valid email!'],
    lowercase: true,
  },

  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'guide'],
      message: 'Roles can either be user, admin or guide!!',
    },
    default: 'user',
  },

  password: {
    type: String,
    minlength: 6,
    required: [true, 'Please enter your password.'],
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // Only works on CREATE or SAVE
      validator: function (val) {
        return this.password === val;
      },
      message: 'The passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  photo: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = async (enteredPass, userPass) => {
  return await bcrypt.compare(enteredPass, userPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const timeChanged = parseFloat(this.passwordChangedAt.getTime() / 1000);

    // console.log(JWTTimeStamp, timeChanged);
    return timeChanged > JWTTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
