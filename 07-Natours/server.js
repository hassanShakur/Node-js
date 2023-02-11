/* eslint-disable node/no-extraneous-require */
const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception, shutting down...');
  process.exit(1);
});

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
  .then(() => {
    // console.log(con.connection.name);
    console.log('DB connection successful...');
  });

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unandled Rejection, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

// console.log(process.env);
