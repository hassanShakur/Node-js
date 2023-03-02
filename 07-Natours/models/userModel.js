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
      values: ['user', 'admin', 'guide', 'lead-guide'],
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

  passwordConfirm: {
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
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  photo: String,
});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 12);

//   this.passwordConfirm = undefined;
// });

// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   // The minus ensures that the token is always created after the password changed time
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

// userSchema.pre(/^find/, function (next) {
//   // This points to current query
//   this.find({ isActive: { $ne: false } });
//   //Or
//   // this.find({ isActive: true });
//   next();
// });

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
