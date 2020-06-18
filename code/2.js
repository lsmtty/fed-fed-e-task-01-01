const fp = require('lodash/fp');
const { flowRight } = require('lodash');

const cars = [
    { name: 'AA', horsepower: 500, dollar_value: 500, in_stock: true},
    { name: 'BB', horsepower: 500, dollar_value: 500, in_stock: false},
    { name: 'CC', horsepower: 550, dollar_value: 132000, in_stock: true},
    { name: 'DD', horsepower: 525, dollar_value: 114200, in_stock: false}
];

// 1
const isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last);
console.log(isLastInStock(cars));

// 2

const getFirstName = fp.flowRight(fp.prop('name'), fp.first);
console.log(getFirstName(cars));

// 3

const _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length;
}

const averageDollarValue = fp.flowRight(_average, fp.map((car) => { return car.dollar_value}));
console.log(averageDollarValue(cars));

// 4

let _underscore = fp.replace(/\W+/g, '_');

const santizeNames = fp.map(fp.flowRight(_underscore, fp.toLower));

console.log(santizeNames(['Lsm tty', ' 3 333IM2']));
