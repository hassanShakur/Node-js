const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received');
  res.end('Request received successfully');
});

server.on('request', (req, res) => {
  console.log('Another request 🫡');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening...');
});
