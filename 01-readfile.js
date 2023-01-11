// File system
const fs = require('fs');

// Reading from file
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

// Write to file
const textOut = `Some read info: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
