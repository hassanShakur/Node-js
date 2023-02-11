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

  photo: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = async (enteredPass, userPass) => {
  // Could have used this.password but password is set as not selected and so this wont work and the pass has to be passed in as a parameter.
  return await bcrypt.compare(enteredPass, userPass);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
