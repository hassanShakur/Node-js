const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    // console.log(doc);

    if (!doc) {
      return next(new AppError('Document with that ID not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   console.log(tour);

//   if (!tour) {
//     return next(new AppError('Tour not found', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
