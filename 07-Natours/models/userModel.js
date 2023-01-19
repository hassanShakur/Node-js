const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
  },

  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    unique: [true, 'This email is already in use.'],
    lowercase: true,
  },

  password: {
    type: String,
    minlength: 6,
    required: [true, 'Please enter your password.'],
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password.'],
  },

  photo: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
