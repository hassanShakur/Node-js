const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const path = req.url;

  if (path === '/' || path === '/home') {
    res.end('Welcome home');
  } else if (path === '/exp') {
    res.end('Experience page');
  } else if (path === '/api') {
    // Option path
    // fs.readFile('./dev-data/data.json');
    fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
      //   const info = JSON.parse(data);
      //   console.log(info);
      // ? Inform browser type of data being sent
      res.writeHead(200, { 'Content-type': 'application/json' });
      // ! End always sends string
      res.end(data);
    });

  } else {
    res.writeHead(404);
    res.end('<h3>Page not found pal!</h3>');
  }
});

// * Callback is optional but shows listening has started successfully
server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening started...');
});
