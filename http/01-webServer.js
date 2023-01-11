const http = require('http');

// Create & Start server
// * Callback is executed whenever a request hits the server
const server = http.createServer((req, res) => {
  // console.log(res);
  res.end('Response from server!');
});

// * Callback is optional but shows listening has started successfully
server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening started...');
});
