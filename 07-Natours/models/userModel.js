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

    console.log(JWTTimeStamp, timeChanged);
    return timeChanged > JWTTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
