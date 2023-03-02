const fs = require('fs');
const dotenv = require('dotenv');

const mongoose = require('mongoose');

const Tour = require(`${__dirname}/../../models/tourModel`);
const User = require(`${__dirname}/../../models/userModel`);
const Review = require(`${__dirname}/../../models/reviewModel`);

dotenv.config({ path: `${__dirname}/../../config.env` });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.ENCODED_DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//   })
//   .then((con) => {
//     console.log(con.connection.name);
//     console.log('DB connection successful...');
//   });

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then((con) => {
  console.log('DB connection successful...');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data imported successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();

console.log(process.argv);
