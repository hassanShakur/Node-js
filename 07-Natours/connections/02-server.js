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
    console.log(con.connection.name);
    console.log('DB connection successful...');
  });

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour needs a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour needs a price'],
  },
  difficulty: String,
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log('Error 💥💥', err));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
