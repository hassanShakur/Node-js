// File system
const fs = require('fs');

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) return console.error('ERROR 🌋');

  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf8', (err) => {
        console.log('File written asyncly 😁');
      });
    });
  });
});

console.log('Is reading...');

// ? ES 6 STYLE
// import { readFile, writeFile } from 'fs';

// readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf8', (err) => {
//         console.log('File written asyncly 😁');
//       });
//     });
//   });
// });

// console.log('Is reading...');
