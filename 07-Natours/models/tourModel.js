const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour needs a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour needs a duration'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour needs a price'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour needs a difficulty'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour needs a group size'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour needs a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour needs a cover image'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  priceDiscount: Number,
  images: [String],
  startDated: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
