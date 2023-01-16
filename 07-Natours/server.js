/* eslint-disable node/no-extraneous-require */
const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose.set('strictQuery', false);

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

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connection.name);
    console.log('DB connection successful...');
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
