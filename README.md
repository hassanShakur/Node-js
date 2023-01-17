# Node

- [Node](#node)
  - [Modules](#modules)
    - [Files](#files)
      - [Asynchronous](#asynchronous)
      - [Synchronous Non-Blocking](#synchronous-non-blocking)
    - [Http Server](#http-server)
      - [Simple Web Server](#simple-web-server)
      - [Routing](#routing)
    - [Events, Listeners \& Emmiters](#events-listeners--emmiters)
    - [Streams](#streams)
    - [Require under the hood](#require-under-the-hood)
      - [Group](#group)
      - [Individual](#individual)
  - [Express](#express)
    - [Handling URL Parameters (CRUD)](#handling-url-parameters-crud)
      - [1. Create](#1-create)
        - [Middleware](#middleware)
      - [2. Read](#2-read)
      - [3. Update](#3-update)
      - [4. Delete](#4-delete)
    - [Code Refactoring](#code-refactoring)
    - [More on Middleware](#more-on-middleware)
    - [Router Mounting](#router-mounting)
    - [Param Middleware](#param-middleware)
    - [Chaining Multiple Middleware Functions](#chaining-multiple-middleware-functions)
    - [Serving Static Files](#serving-static-files)
  - [Environment Variables](#environment-variables)
  - [MongoDB](#mongodb)
    - [Mongo Create](#mongo-create)
    - [Mongo Read](#mongo-read)
    - [Mongo Updating](#mongo-updating)
    - [Mongo Deleting](#mongo-deleting)
  - [Mongoose](#mongoose)
    - [Connection](#connection)
    - [Schemas and Models](#schemas-and-models)
    - [Mongoose Crud Documents From Models](#mongoose-crud-documents-from-models)
      - [1. Creating Documents](#1-creating-documents)
        - [Alternate Doc Creation](#alternate-doc-creation)
      - [2. Reading Documents](#2-reading-documents)
      - [2. Updating Documents](#2-updating-documents)
      - [2. Deleting Documents](#2-deleting-documents)
    - [Simple Querying Functionality](#simple-querying-functionality)
    - [Advanced Filtering](#advanced-filtering)
    - [Sorting](#sorting)
    - [Projection (Field Limiting)](#projection-field-limiting)
    - [Pagination](#pagination)
    - [Aggregation Pipelining - Matching \& Grouping](#aggregation-pipelining---matching--grouping)
      - [Routing](#routing-1)
      - [Implementation](#implementation)
      - [Unwinding \& Projecting](#unwinding--projecting)
    - [Virtual Properties](#virtual-properties)
    - [Mongoose Middlewares (pre \& post hooks)](#mongoose-middlewares-pre--post-hooks)
      - [Document Middleware](#document-middleware)
      - [Query Middleware](#query-middleware)

## Modules

### Files

#### Asynchronous

```js
const fs = require('fs');

// Readinng
const textRead = fs.readFileSync(
  './path/to/file/to/read.txt',
  'utf-8'
);

// Writing
const textWrite = `Some read info...`;
fs.writeFileSync('./path/to/file/to/write.txt', textWrite);
```

#### Synchronous Non-Blocking

```JS
fs.readFile('./path/to/file/to/read.txt', 'utf-8', (err, data1) => {
    // View data... If error, do sth.
}

// Callback is always optional
fs.writeFile('./path/to/file/to/write.txt', `${textWrite}`, 'utf8', (err /*No data*/) => {
    console.log('File written asyncly 😁');
});
```

### Http Server

#### Simple Web Server

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Response from server!');
});

// * Callback is optional but shows listening has started successfully
server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening started...');
});
```

#### Routing

```js
const server = http.createServer((req, res) => {
  const path = req.url;

  if (path === '/' || path === '/home') {
    res.end('Welcome home');
  } else if (path === '/exp') {
    res.end('Experience page');
  } else {
    // res.writeHead(404);
    // res.end('Page not found!');

    // ? You can include your own headers as status message
    res.writeHead(404, {
      'Content-type': 'text/html',
      'custom-header': 'some own header text',
    });
    res.end('<h3>Page not found pal!</h3>');
  }
});
```

### Events, Listeners & Emmiters

```js
const EventEmmiter = require('events');

class Project extends EventEmmiter {
  constructor() {
    super();
  }
}

const myEmmiter = new Project();

myEmmiter.on('newProject', () => {
  console.log('Start of a new project');
});

// Several liteners can be set on the same event
myEmmiter.on('newProject', (type) => {
  console.log(`The project is on ${type}`);
});

// Other arguments after emmiter are parameters to the listeners
myEmmiter.emit('newProject', 'Computer Science');
```

### Streams

Is an efficient way of data transmision in which info is read in chunks and sent to client without waiting for the entire read process to end, save it to a variable then respond. It clears the memory whenever a `readable stream` is complete and sends it back as `data` event.

```js
const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  const readable = fs.createReadStream('big-file.txt');

  readable.on('data', (chunk) => {
    res.write(chunk);
  });

  readable.on('end', () => {
    res.end();
  });

  readable.on('error', (err) => {
    console.log(err);
    res.statusCode = 500;
    res.end('File not found!');
  });
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
```

Thou this works, `Backpressure` can occur as the readable stream is much faster than the writable and therefore overwhelms it. The solution is using the `pipe()` where, `readableSource.pipe(writableDestination)`, where it regulates how fast the process happens. Eg for the above:

```js
const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  const readable = fs.createReadStream('test-file.txt');

  readable.pipe(res);
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
```

### Require under the hood

On requiring a module, it's wrapped in a `IEFE` as below which is seen in logging `require('module').wrapper`.

```js
[
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});',
];
```

Exports can be done individually or as a group.

#### Group

```js
class Calculator {
  add(a, b) {
    return a + b;
  }
  multiply(a, b) {
    return a * b;
  }
}

module.exports = Calculator;
```

Then imported and used as:

```js
const Calc = require('./Calculator');
const calc1 = new Calc();
calc1.add(1, 2);
```

#### Individual

```js
exports.subtract = (a, b) => a - b;
exports.divide = (a, b) => a / b;
```

```js
const { subtract, divide } = require('./02-multipleExports');
divide(9, 3);
```

## Express

Build on top of Node.

### Handling URL Parameters (CRUD)

#### 1. Create

```js
const express = require('express');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      console.log(err);
    }
  );

  // 201 for creation
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

app.listen(3000, () => {
  console.log('App running on port 3000...');
});
```

##### Middleware

Middleware is a function can be used in `post` to modify incoming request data. It's created as:

```js
app.use(express.json());
```

#### 2. Read

```js
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});
```

#### 3. Update

```js
app.patch('/api/v1/tours/:id', (req, res) => {
  // Search ID and update contents

  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour>',
    },
  });
});
```

#### 4. Delete

```js
app.delete('/api/v1/tours/:id', (req, res) => {
  // Search ID and update contents

  // 204 No Content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
```

### Code Refactoring

The above could be separated into functions and further combine related paths using `app.route`

```js
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
```

### More on Middleware

They are like subfunctions in express. Almost everything is a middleware including the routing and data transfer that all make up the `request-response cycle`. Every middleware has access to a `next()` function which must be called unless it is a final middleware which sends data back `res.send`. If not called, the middlewares coming after it wont be run. If a `.send()` is called before other middlewares of the same or non-specified paths, then thats where middleware execution stops.
Middlewares without specific paths are run for every code execution.

```js
app.use((req, res, next) => {
  console.log('Middleware called 👋');
  next();
});
```

It can also me used to add properties to the request to use later, eg adding time like:

```js
app.use((req, res, next) => {
  req.timeRequested = new Date().toISOString();
  next();
});
```

### Router Mounting

Mounting an `express router` on another in order to distribute workload.

```js
const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.use('/api/v1/tours', tourRouter);
```

### Param Middleware

Middleware that runs only for a particular parameter specified in request url. Eg for `id` parameter:

```js
router.param('id', (req, res, next, val) => {
  console.log(`ID is ${val}`);
  next();
});
```

It has the 4th argument which holds the value of the param.
Can be used to validate the id for every router that needs it.

```js
exports.checkID = (req, res, next, val) => {
  console.log(`ID is ${val}`);

  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }
```

### Chaining Multiple Middleware Functions

```js
router
  .route('/')
  .get(getAllTours)
  .post(tourControllers.checkBody, createTour);
```

The `tourControllers.checkBody` is an extra middleware checking if the `createTour` request body has all necessary parameters before it being created.

```js
exports.checkBody = (req, res, next) => {
  const tourBody = req.body;
  const { id, price } = tourBody;

  if (!id || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Tour price and ID are required!!',
    });
  }
  next();
};
```

### Serving Static Files

Are files that can't be accessed from the url. `express.static` middleware is used to provide the dir with the static files which will then act as root. So to access any file inside the dir, go to localhost then the path to file without including the parent dir.

```js
app.use(express.static(`${__dirname}/public`));
```

To access: `127.0.0.1:<portNum>/fileName.txt, html...` if `fileName` is a file in `public` folder.

## Environment Variables

These are outside of `express` and are created by node. To view the env var by express:

```js
console.log(app.get('env')); // Returns 'environment
console.log(process.env);
```

Variables created by node can be seen through:

```js
console.log(process.env);
```

`env vars` are configured in the `config.env` file and injected in nodes env vars using `dotenv` package.

- In `config.env`

```js
NODE_ENV = development;
PORT = 3000;
```

- In `server.js` before requiring `app.js` in order to have access

```js
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
```

Depending on set envs, different codes can be run at different places eg in the `package.json`s scripts, 2 npm starts can be set for either in `production` or `development`.

```js
"start:dev": "nodemon server.js",
"start:prod": "NODE_ENV=production nodemon server.js"
```

And back in `app.js`:

```js
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

## MongoDB

### Mongo Create

- Create db
  ```js
  use dbName
  ```
- Create collections within a `document`. The objects are input like in `JSON` but will be stored as `BSON`.
  ```js
  db.docName.insertMany({}, {});
  ```

### Mongo Read

- See all dbs or collections
  ```js
  show dbs
  db.docName.find()
  ```
- Search for specific collection
  ```js
  db.docName.find({property<SearchParam>: "value"})
  ```
- Query for specific range in collection
  ```js
  db.docName.find({ price: { $lte: 300 } }); // Will return all prices <=300
  ```
- And query
  ```js
  db.docName.find({ price: { $lte: 300 }, age: { $gt: 20 } });
  ```
- Or query
  ```js
  db.docName.find({
    $or: [{ price: { $lte: 300 } }, { age: { $gt: 20 } }],
  });
  ```
- Object projection - Selecting specific fields from the output. Eg to get only the names:

  ```js
  db.docName.find(
    { price: { $lte: 300 }, age: { $gt: 20 } },
    { name: 1 }
  );
  ```

  ![Alt text](07-Natours/public/img/mongo-1.png)

### Mongo Updating

You can use `updateOne` or `updateMany` as needed, and use `$set` var for setting.

```js
db.docName.updateOne(
  { name: 'Some Namme' },
  { $set: { age: 'Age to set' } }
);
```

![Alt text](07-Natours/public/img/mongo-2.png)

Replacing a collection is similar to update. Pass in the search criteria and its done.

```js
db.docName.replaceOne({<SearchQuery>}, {<NewData>});
```

### Mongo Deleting

Use `deleteOne` or `deleteMany` together with search query.

```js
db.docName.deleteOne({<SearchQuery>});
```

To delete all, search query is left empty:

```js
db.docName.deleteMany({});
```

## Mongoose

### Connection

```js
mongoose
  .connect(process.env.ENCODED_DATABASE_PASSWORD, {
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connection.name); DB name
    console.log('DB connection successful...');
  });
```

### Schemas and Models

A schema is a baseline for describing a model. It contains the properties and data types with other specifications. A model is like a blueprint made out of schema objects used in creation of a database.

```js
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
```

### Mongoose Crud Documents From Models

#### 1. Creating Documents

The docs are created as insatnces of models. The `new Tour()` returns a promise that resolves with the document if no errors are encountered.

```js
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
```

##### Alternate Doc Creation

```js
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```

#### 2. Reading Documents

Only the query changes:

```js
const tour = await Tour.findById(req.params.id);
```

#### 2. Updating Documents

Several methods can be used including `findIdAndUpdate` which takes the ID to search for, the body to update to and options eg `new` returns a new tour after the update, `runValidators` will run the update through the described validations in the `schema`.

```js
const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
  runValidators: true,
});
```

#### 2. Deleting Documents

```js
const tour = await Tour.findOneAndDelete(req.params.id);
```

### Simple Querying Functionality

To query a parameter sent through the url:

```js
const tours = await Tour.find(req.query);
```

```js
const tours = await Tour.find({
  key: value,
  key2: val2,
});
```

```js
const tours = await Tour.find()
  .where('duration')
  .gte(5)
  .where('difficulty')
  .equals('easy');
```

### Advanced Filtering

Sample query url:

```js
127.0.0.1:3000/api/v1/tours/?difficulty=easy&duration[gte]=5&page=1&duration[lt]=9
```

Parameters such as `greater than` and the likes are put in square brackets. But upon calling the `req.query`, they miss the `$` as it is to be in `mongoDB` queries. So the addition is done manually as:

```js
let queryStr = JSON.stringify(queryObj);
queryStr = queryStr.replace(
  /\b(gt|lt|gte|lte)\b/g,
  (match) => `$${match}`
);
console.log(JSON.parse(queryStr));

let query = Tour.find(JSON.parse(queryStr));
const tours = await query;
```

Plus the await is done on the complete query after manipulation.

### Sorting

Url with such formatting:

```js
127.0.0.1:3000/api/v1/tours/?sort=-price,ratingsAverage
```

The sorting is done first on prices then ratings. Since the query func expects them space separated, split them up based on comma then rejoin with space to pass them in as parameters.

```js
if (req.query.sort) {
  const sortBy = req.query.sort.split(',').join(' ');
  console.log(sortBy);
  query = query.sort(sortBy); // sort(param1, param2) === sort(param1 param2)
}
```

A negative before the param makes it sorted in desc.

### Projection (Field Limiting)

Sample url

```js
127.0.0.1:3000/api/v1/tours/?fields=name,price,duration,difficulty
```

A negative before excludes it from the selection.

```js
if (req.query.fields) {
  const fields = req.query.fields.split(',').join(' ');
  query = query.select(fields);
} else {
  query = query.select('-__v');
}
```

Sensitive info can be excluded from the schema by setting `select` to `false`.

```js
createdAt: {
  type: Date,
  default: Date.now(),
  select: false,
}
```

### Pagination

Specified using `skip()` and `limit()`.

```js
const limit = req.query.limit || 100;
const page = req.query.page || 1;
const skip = (page - 1) * limit;

query = query.skip(skip).limit(limit);

if (req.query.page) {
  const totalTours = await Tour.countDocuments();
  if (limit * page > totalTours)
    throw new Error("Page doesn't exist!!!");
}
```

### Aggregation Pipelining - Matching & Grouping

Pipelining involves passing a route through several filters executed in the order of appearance and each stage returning specified fields in matching, grouping etc.

#### Routing

```js
router
  .route('/tour-stats')
  .get(tourControllers.tourStats, getAllTours);
```

#### Implementation

```js
exports.tourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```

#### Unwinding & Projecting

`Unwinding` involves breaking a document into different separate documents each with one value of a property that was an array of the original one document. Eg

```js
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numOfTours: { $sum: 1 },
          tours: { $push: '$name' },
          avgRating: { $avg: '$ratingsAverage' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numOfTours: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```

### Virtual Properties

Are calculated properties and thus not stored in the database. They also can't be used in queries. In order to be displayed, a second parameter is passed to the parent schema.

```js
const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
  {
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
    price: {
      type: Number,
      required: [true, 'A tour needs a price'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour needs a difficulty'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
```

### Mongoose Middlewares (pre & post hooks)

They can be used to run a fuctionality between 2 events eg before saving a doc and after. They are defined on the schema & are 4 types:

1. Document
2. Query
3. Aggregate
4. Model

#### Document Middleware

Can act on currently processed middleware. They include `save`, `delete`, `remove` and such doc manipulators. The `pre` has access to `this` which points to the current document being worked on. They all have `next()` same as any other middleware.

```js
// Middleware executed between .create() and .save()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});
```

#### Query Middleware

Acts between the request for a query and the time the query is presented as results. Includes `find`, `findOne`, and such. Here the `this` points to a query object and therefore chaining with other queries is posible. A simple pre middleware one for `find` would be like:

```js
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
```

Using regular expressions to track all queries with word `find` would be:

```js
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds.`);
  next();
});
```
