const Calc = require('./01-oneExport');

const { subtract, divide } = require('./02-multipleExports');

const calc1 = new Calc();

console.log(calc1.add(1, 2));
console.log(divide(9, 3));
console.log(require('module').wrapper);
