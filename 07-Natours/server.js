/* eslint-disable node/no-extraneous-require */
const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.ENCODED_DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log(con.connection);
    console.log('DB connection successful...');
  });

// console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
