const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = (card, item) => {
  let output = card.replace(/{%PRODUCTNAME%}/g, item.productName);
  output = output.replace(/{%IMAGE%}/g, item.image);
  output = output.replace(/{%PRICE%}/g, item.price);
  output = output.replace(/{%LOCATION%}/g, item.from);
  output = output.replace(/{%NUTRIENTS%}/g, item.nutrients);
  output = output.replace(/{%QUANTITY%}/g, item.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, item.description);
  output = output.replace(/{%ID%}/g, item.id);

  if (!item.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const tempHome = fs.readFileSync(
  `${__dirname}/Farm/templates/template-home.html`,
  'utf8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/Farm/templates/template-card.html`,
  'utf8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/Farm/templates/template-product.html`,
  'utf8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const infoObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  // console.log(url.parse(req.url, true));
  const path = req.url;
  const { query, pathname } = url.parse(path, true);

  // ? Home
  if (pathname === '/' || pathname === '/home') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = infoObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempHome.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // ? Product page
  } else if (pathname === '/product') {
    // console.log(query);
    res.writeHead(200, { 'Content-type': 'text/html' });
    const productObj = infoObj[query.id];
    const output = replaceTemplate(tempProduct, productObj);

    res.end(output);

    // ? API page
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // ? Not Found
  } else {
    res.writeHead(404);
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end('<h3>Page not found pal!</h3>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening started...');
});
