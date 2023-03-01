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
      - [Aggregation Middleware](#aggregation-middleware)
    - [Data Validation](#data-validation)
    - [Custom Validators](#custom-validators)
    - [Handling unhandled Routes](#handling-unhandled-routes)
    - [Merging Error Creation Using Classes](#merging-error-creation-using-classes)
    - [Catching All `try... catch` Errors in a Go](#catching-all-try-catch-errors-in-a-go)
    - [Unhandled Promise Rejections](#unhandled-promise-rejections)
    - [Uncaught Exceptions](#uncaught-exceptions)
    - [Advanced Error Handling](#advanced-error-handling)
  - [Authentication, Authorization \& Security](#authentication-authorization--security)
    - [Password Encryption](#password-encryption)
    - [Token Genenration With JsonWebToken](#token-genenration-with-jsonwebtoken)
    - [Loging in Logic](#loging-in-logic)
    - [Reasource Protection Based on Authentication](#reasource-protection-based-on-authentication)
      - [Adding The Middleware](#adding-the-middleware)
      - [Check Header for Authorization Token](#check-header-for-authorization-token)
      - [Verify the Token](#verify-the-token)
      - [Find the User with the Id \& Ensure Password Hasn't Been Changed](#find-the-user-with-the-id--ensure-password-hasnt-been-changed)
    - [Restricting Request Actions Based on User Roles](#restricting-request-actions-based-on-user-roles)
    - [Handling Forgot Password](#handling-forgot-password)
      - [1. Configure the email in a separate file](#1-configure-the-email-in-a-separate-file)
      - [2. Back to the AuthController](#2-back-to-the-authcontroller)
    - [Handling Reset Password](#handling-reset-password)
    - [Password Update](#password-update)
    - [Updating User Details](#updating-user-details)
    - [Delete User](#delete-user)
  - [Other Security Concerns](#other-security-concerns)
    - [Cookies In Sending JWT](#cookies-in-sending-jwt)
    - [Rate Limiting](#rate-limiting)
    - [Setting Security HTTP Headers](#setting-security-http-headers)
    - [Simple Email Hack](#simple-email-hack)
    - [Prevent Parameter Polution](#prevent-parameter-polution)
  - [Data Modelling](#data-modelling)
    - [Tweak on Embedding](#tweak-on-embedding)
    - [Referencing](#referencing)

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

This code:

```js

    toJSON: { virtuals: true },
    toObject: { virtuals: true },

```

... makes sure that these calculated properties (virtual) that arent stored in the DB always show up whenever a query is made.

### Mongoose Middlewares (pre & post hooks)

They can be used to run a fuctionality between 2 events eg before saving a doc and after. They are defined on the schema & are 4 types:

1. Document
2. Query
3. Aggregate
4. Model

#### Document Middleware

Can act on currently processed middleware. They include `save`, `delete`, `remove` and such doc manipulators. The `pre` has access to `this` which points to the current document being worked on. They all have `next()` same as any other middleware.

```js
// Middleware only runs for .create() and .save() but not update()
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

#### Aggregation Middleware

Run between agregate actions and pipelines. `this` refers to any aggregate action. Sample:

```js
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
```

Logging `this.pipeline()` returns the aggregate that was executed (like below) and thus other properties can be added using the `unshift` to add to start or `shift`.

```js
[
  { $match: { ratingsAverage: [Object] } },
  {
    $group: {
      _id: [Object],
      numTours: [Object],
      numRatings: [Object],
      avgRating: [Object],
      avgPrice: [Object],
      minPrice: [Object],
      maxPrice: [Object],
    },
  },
  { $sort: { avgPrice: 1 } },
];
```

### Data Validation

They are specified in the model in the schema. Examples are `minLength` & `maxLength` for strings, `min` & `max` for nums and dates, `enum` for a range of accepted values eg

```js
difficulty: {
  type: String,
  required: [true, 'A tour needs a difficulty'],
  enum: {
    values: ['easy', 'medium', 'difficult'],
    message: 'Difficulty can only be easy, medium or difficult!',
  },
},
```

### Custom Validators

To note is the `this` only points to current doc on NEW DOC creation and not the same in updating.

```js
priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return this.price > val;
        },
        message: 'Discount value ({VALUE}) must be below regular price!',
      },
    }
```

A third party library like`validator.js` could be used for most of these.

### Handling unhandled Routes

The `app.all()` route is used to handle all requests and `*` for all routes.

```js
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `The url ${req.originalUrl} couldnt be found on server.`,
  });
  next();
});
```

### Merging Error Creation Using Classes

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperationalError = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

With this, whenever a new error is to be created, the following is passed to the `next` middleware function:

```js
next(
  new AppError(
    `The url ${req.originalUrl} couldnt be found on server!!!`,
    404
  )
);
```

### Catching All `try... catch` Errors in a Go

To achieve this, all async funcs/middlewares with `try catch` block are called using a high order function that takes this async func as a parameter and calls it, then add a `.catch(next)` statement on it so that any unandled promises are caught and passed to the `next()`.

The longer syntax for calling the `catch` is:

```js
fn(req, res, next).catch((err) => next(err));
```

The high order function:

```js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

Back at the error generators:

```js
exports.createTour = catchAsync(async(...) => {...}
```

### Unhandled Promise Rejections

They can be captured globally using the listener `process.on`. The `1` in `exit` implies an unhandled exeption.

```js
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unandled Rejection, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
```

### Uncaught Exceptions

Should be put in server and above most code to listen to all. They include undefined vars and such.

```js
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception, shutting down...');
  process.exit(1);
});
```

### Advanced Error Handling

Sending different errors in prod and development could be implemented in the `errorcontroller`. This would be as:

```js
if (process.env.NODE_ENV === 'development') {
  sendErrorDev(err, res);
} else if (process.env.NODE_ENV === 'development') {
  sendErrorProd(err, res);
}
```

The funcs just serve different levels of info

```js
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming error
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!!!',
    });
  }
};
```

## Authentication, Authorization & Security

### Password Encryption

Made use of `bcryptjs`. Salt value is 12 but default is 10. The higher the more cpu intensive. Implemented using a middleware before record save. Only re-encrypted if it has changed and `passwordConfirm` is not retained in the database.

```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});
```

### Token Genenration With JsonWebToken

The `jwt.sign` takes in the `identifier` to use to create the token, the secret key you define to be used that should be atleast 32 chars long for higher sec, and optional options as an object.

```js
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    // User creation
  });

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
```

### Loging in Logic

An `instance` method is available on alldocs of a certail collection. They are created using `schemaName.methods.instanceMethodName`. It is implemented in the model where the schema is also defined. This is used to compare the passwords.

In this method, `this.password` could have been used but password is set as not selected and so this wont work and the password now has to be passed in as a parameter.

```js
userSchema.methods.correctPassword = async (
  enteredPass,
  userPass
) => {
  // Could have used this.
  return await bcrypt.compare(enteredPass, userPass);
};
```

Then back to the `authController`...

```js
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // If details are provided
  if (!email || !password) {
    return next(
      new AppError('Please provide email and password', 404)
    );
  }

  //? If user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  console.log(user);

  // const correct = await user.correctPassword(password, user.password);

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // Everything OK
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
```

401 status is for `unauthorized`.

### Reasource Protection Based on Authentication

#### Adding The Middleware

In the `router` for the resource to protect, add a middleware before the middleware handler so it is only run after authentication is approved.

```js
router.route('/').get(protect, getAllTours).post(createTour);
```

#### Check Header for Authorization Token

Then in the `authController`, the logic for the `protect` middleware is applied. First the auth token is read from the `request header` named `authorization` and its value starts with `Bearer` followed by the token.

```js
const auth = req.headers.authorization;
let token;
if (auth && auth.startsWith('Bearer')) {
  // authorization: Bearer sometokenstring
  token = auth.split(' ')[1];
}

if (!token)
  return next(new AppError('Please log in to continue', 401));
```

#### Verify the Token

If the token exists, it is verified by the func `jwt.verify()` which takes in the token and the secret key. The third param is a callback to handle its response but the function can be `promisified` and just await the response. The `util` is an inbuilt node module.

```js
const { promisify } = require('util');

// Later

const decoded = await promisify(jwt.verify)(
  token,
  process.env.JWT_SECRET_KEY
);
```

The promise resolves to an object with the `id` used to create the token, its `issue time` as `iat` and `expiration time` as `exp`.

```js
{ id: '63e8adc3ed5a9deeac7ea6a9', iat: 1676193417, exp: 1676452617 }
```

#### Find the User with the Id & Ensure Password Hasn't Been Changed

You can then check to see if the user still exists by finding them using the id. An extra verification may be to ensure that from the time the token was issued to the time it's being used, the user password has not been changed. This can be accomplished by another user defined method in the schema like `userModel`.

```js
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const timeChanged = parseFloat(
      this.passwordChangedAt.getTime() / 1000
    );

    console.log(JWTTimeStamp, timeChanged);
    return timeChanged > JWTTimeStamp;
  }
  return false;
};
```

The func returns `true` if the password was changed recently. This func is then called in the auth controller.

```js
if (currUser.changedPasswordAfter(decoded.iat)) {
  return next(
    new AppError(
      'User password changed recently. Please login again.'
    )
  );
}
```

If all goes well, the user can access the route. The general structure would look as below.

```js
exports.protect = catchAsync(async (req, res, next) => {
  // Check if token is included in header
  const auth = req.headers.authorization;
  let token;
  if (auth && auth.startsWith('Bearer')) {
    // authorization: Bearer sometokenstring
    token = auth.split(' ')[1];
  }

  if (!token)
    return next(new AppError('Please log in to continue', 401));
  // console.log(token);

  // Authenticity of token - Verification

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  // console.log(decoded);

  // If user still exists
  const currUser = await User.findById(decoded.id);

  if (!currUser) {
    return next(
      new AppError(
        'The owner for this token no longer exists!!!',
        401
      )
    );
  }

  // If user changed password after token was issued
  if (currUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User password changed recently. Please login again.'
      )
    );
  }

  // Grant access
  req.user = currUser;
  next();
});
```

### Restricting Request Actions Based on User Roles

First add user roles in the schema for the user model.

```js
role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'guide'],
      message: 'Roles can either be user, admin or guide!!',
    },
    default: 'user',
  },
```

Then implements the middleware in the route after the `protect` so it can access the `user` object set in the protection stage on the `req.user` property.

```js
router.delete(protect, restrictTo('admin'), deleteTour);
```

Now creating the middleware function `restrictTo()` on the `authController` to implement the details.

```js
exports.restrictTo = (...roles) => {
  // Roles can be an array of permitted users/roles passed into this function
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You are not aythorized to perform this operation!!!',
          403
        )
      );
    }
    next();
  };
};
```

Important to note that this step depends on the previous middleware else the role of the user could not be read.

### Handling Forgot Password

Create a route for `forgotPassword` where an email for the account to recover in sent.

```js
router.post('/forgotPassword', forgotPassword);
```

Then handle the middleware in the authController with steps as:

1. Check if User Exists
2. Generate random token to be used as a reset token.

This token is sent to the email and a copy of its encrypted version is kept in the database on a field `passwordResetToken`, and an expiration time `passwordResetExpires`. Thus a method in the model will be useful.

```js
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
```

The method creates a 32 bit long token, of which its encrypted version is stored in the db. It makes use of an inbuilt encryption module:

```js
const crypto = require('crypto');
```

3. Save the document with the current edited fields. the `validateBeforeSave` temporarily clears the rules set that a request must have certain fields.

```js
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Check if user exists using email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with that email!!', 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
});
```

4. Send the token to the described email.

Gonna be using `nodemailer` and `mailtrap`. It's quite a process.

#### 1. Configure the email in a separate file

```js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    authMethod: process.env.EMAIL_AUTH_METHOD,
  });

  // Define email options
  const mailOptions = {
    from: 'Hassan Shakur <hassanshakur.dev@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
```

#### 2. Back to the AuthController

1. Create the url to be sent for user to send a patch request to.
2. Create the message to send
3. Send the email with options.

```js
const sendEmail = require('../utils/email');

// Later ...
// Send url to user's email
const resetURL = `${req.protocol}://${req.get(
  'host'
)}/api/v1/users/resetPassword/${resetToken}`;

const message = `We've received a password reset request. Please submit a PATCH request to ${resetURL} with the new password and confirm password.\nIf you didn't forget your password just ignore this email.`;

try {
  await sendEmail({
    email: user.email,
    subject: `Password reset token, (valid for 10 mins)`,
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Check your email for the token!',
  });
} catch (err) {
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save({ validateBeforeSave: false });

  console.log(err);
  return next(
    new AppError('Something went wrong! Please try again later.', 500)
  );
}
```

### Handling Reset Password

Email is sent containing a url to make a `patch` request for reseting the password. The request has the client token appended as a param and it's captured in the router as:

```js
router.patch('/resetPassword/:token', resetPassword);
```

The `resetPassword` function in the `auth` has 4 steps:

1. Get the user using by using the hashed token received as it was saved before.
2. Check if token is valid or has expired.
3. Update `passwordChangedAt` prop from the `model`

```js
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
```

The minus ensures that the token is always created after the password changed time so the user need not login again after this. removing it will require a login with the new password.

4. Send token and login the user. The procedure would be as:

```js
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Token hasnt expired and there is a user, set new password
  if (!user) {
    return next(
      new AppError('Token is invalid or has expired!', 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  // Update passwordChangedAt property

  // Log user in and send jwt token
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
```

### Password Update

Done when user is already logged in so the request will be protected.

```js
router.patch('/updateMyPassword', protect, updatePassword);
```

User enters `passqordCurrent`, `newPassword` and `confirmPassword` in a `patch` request. The curr pass in compared with db curr pass using the earlier method `correctPassword`. If true, the new password is saved and token sent.

```js
const sendTokenResponse = (userId, statusCode, res) => {
  const token = signToken(userId);

  res.status(statusCode).json({
    status: 'success',
    token,
  });
};

// Later
exports.updatePassword = catchAsync(async (req, res, next) => {
  // Find user based on passed id and user from protect middleware
  //? Should Never Use FindByIdAndUpdate as it doesnt run Validatiors
  //? Validators only run on SAVE and NEW doc
  const user = await User.findById(req.user.id).select('+password');
  // console.log(user);

  // Check if POSTed pass is correct
  const correct = await user.correctPassword(
    req.body.passwordCurrent,
    user.password
  );

  if (!correct) {
    return next(new AppError('Wrong password!', 401));
  }

  // Save new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Send token
  sendTokenResponse(user._id, 200, res);
});
```

### Updating User Details

```js
router.patch('/updateme', protect, userControllers.updateMe);
```

```js
exports.updateMe = catchAsync(async (req, res, next) => {
  // Send error if user is tryng to change password
  if (req.body.password || req.body.passwordconfirm) {
    return next(
      new AppError(
        'Please use /updateMyPassword for password update!',
        400
      )
    );
  }

  // select only fields user is allowed to change
  const filteredBody = filterBody(req.body, 'name', 'email');
  console.log(filterBody);

  // Use direct update as password will be required if you try to save
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
```

### Delete User

The user is set to inactive as a property in the user model. A `query middleware` is then used to ensure all queries do not select the inactive users.

```js
router.delete('/deleteMe', protect, userControllers.deleteMe);
```

```js
userSchema.pre(/^find/, function (next) {
  // This points to current query
  this.find({ isActive: { $ne: false } });
  //Or
  this.find({ isActive: true });
  next();
});
```

```js
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
```

## Other Security Concerns

### Cookies In Sending JWT

JWTs can be send through browser cookies to prevent XSS as would happen when sending it via the response as a json string. It is included in the `res` as a cookie. `Secure` ensures the cookie is only sent in `https`, and so on.

```js
const sendTokenResponse = (userId, statusCode, res) => {
  const token = signToken(userId);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // Only send via https
    // secure: false,
    // Ensures the browser or any other person cannot manipulate this cookie
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production')
    cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
  });
};
```

### Rate Limiting

Helps prevent `DOS` and `Brute Force Attacks` by limiting the amount of requests from an IP within a period of time. `express-rate-limit` package can be used. Its applied as a global middleware to the app and the highest global route.

```js
const rateLimit = require('express-rate-limit');

// Then later in same file
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP. Please try again in 1 hour!',
});

app.use('/api', limiter);
```

The `max` is max number of requests within the period `windowMs` in milliseconds. The `message` is sent if the limit is reached. The remaining requests and other limit details are in the header of the response.

### Setting Security HTTP Headers

`helmet` package is used at the topmost of middlewares to ensure all headers have it.

```js
const helmet = require('helmet');
// Later

app.use(helmet());
```

### Simple Email Hack

Logging in with a valid password and email as:

```js
{
    "email":{"$gt": ""},
    "password":"correct"
}
```

The email injection will always return true for all emails and as long as one of the email passwords is used, access is granted.
Sanitization can be applied using `xss-clean` & `express-mongo-sanitize` packages.
The sanitize looks at request `body`, `queries` and `params` and filters all `$` and `dots`. Xss cleans malicious html/js code, by converting html symbols.

```js
// Protection from NoSQL and query injections
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
```

### Prevent Parameter Polution

Eg specifying the sort parameter twice on the same url with different vslues. `hpp` package is used, `HTTP Parameter Pollution`. You can whitelist the fields that multiple queries are allowed.

```js
// Parameter pollution
app.use(
  hpp({
    whitelist: ['duration'],
  })
);
```

## Data Modelling

Including data in data can be done by `reference` or `embedding`. All depends on accesibity of the data and their relationship.
To embed data eg keeping tour guides ids in the tour model can be implemented such that on tour creation, guides' ids are passed to a property `guides: Array` of the tour and in the backend, the guides' details is fetched from the user model.

### Tweak on Embedding

```js
// Before in the same doc for schema
...
guides: Array,

// Later
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(
    async (id) => await User.findById(id)
  );
  this.guides = await Promise.all(guidesPromises);
  next();
});
```

The `guidesPromises` is an array of promises returned from the search and therefore all have to be awaited for resolve before including them in the tour data. Embedding in this case is not best as user details may later change.

### Referencing

Creating a reference to a tour using the tour id can be done as:

```js
 guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
```

This is included in the `tours schema` model. Whenever a query is made, this reference will be responsible for `populating` the results of the query with the relevant user details from the user model.
To populate, a small addition is added to the `getTour` query handler:

```js
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('guides');

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});
```

To exclude some fields about the user, extra options are added to the `populate` function.

```js
const tour = await Tour.findById(req.params.id).populate({
  path: 'guides',
  select: '-__v -passwordChangedAt',
});
```

This will therefore only work for the routes where the populate is specified. A query middleware can be used to populate all queries hitting the tours route.

```js
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
```
