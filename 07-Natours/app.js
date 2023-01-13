const express = require('express');
const fs = require('fs');

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { tours },
  });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

app.listen(3000, () => {
  console.log('App running on port 3000...');
});
