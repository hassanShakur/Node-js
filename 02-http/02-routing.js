const http = require('http');
const url = require('url');

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

// * Callback is optional but shows listening has started successfully
server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening started...');
});
