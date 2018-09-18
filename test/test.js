const assert = require('assert');
const forEach = require('mocha-each')
const Promise = require('bluebird');
const FeeCalc = require('../index').FeeCalc;
const feeCalc = new FeeCalc({feeLogging: false});
const items = [
  {
    ASIN: "B07C1MC7JN",
    price: 19.95,
    category: "Toys & Games",
    weight: 1.4,
    // dimensions: [15.8,15.8,5.9], // Dims on item listing
    dimensions: [1.811, 9.1, 13.07], // Dims on seller calc
    size: 'largeStandard',
    // fee: 4.71}, // without 0.09 storage fee
    fee: 4.8}, // with storage fee
  {
    ASIN: "B07C1TGSW5",
    price: 11.99,
    category: "Cell Phones & Accessories",
    weight: 1.44/16,
    dimensions: [0.944, 3.86, 6.9],
    size: 'largeStandard',
    // fee: 3.19}, // without 0.01 storage fee
    fee: 3.2}, // without 0.01 storage fee
  {
    ASIN: "B077WSF9HN",
    price: 11.99,
    category: "Video Games",
    weight: .5,
    dimensions: [5.5, 2.8, 0.3],
    size: 'smallStandard',
    // fee: 2.41}, // without 0.01 storage fee
    fee: 2.42}, // without 0.01 storage fee
  {
    ASIN: "B076LJHMV4",
    price: 158,
    category: "Home & Kitchen",
    weight: 20.6992,
    dimensions: [8.8,14.2,17.7], // L+Girth = (17.7+14.2)*2 + 8.8 = 72.6
    size: 'smallOver',
    // fee: 15.73},
    fee: 16.34},
  {
    ASIN: 'B06XPH5PBC',
    price: 102.99,
    category: "Books",
    weight: 56,
    dimensions: [13,20,13],
    size: 'smallOver',
    // fee: 29.03},
    fee: 29.97}, // With storage
  {
    ASIN: "B01LXTN83Z",
    price: 147.74,
    category: "Home & Kitchen",
    weight: 31.4,
    dimensions: [97.5,7.5,8.5],
    size: 'mediumOver',
    // fee: 26.16},
    fee: 27.89}
];

describe('Fee Calculator', () => {
  forEach(items)
  .it('Should calculate correct fee', (item) =>{
    return feeCalc.calculateFBAFees(item.price, item.category, item.weight, item.dimensions)
    .then(fee => assert.equal(fee, item.fee))
  });
})
describe('Sizing the Package', ()=>{
  forEach(items)
  .it('Should get correct package size', (item) =>{
    const size = feeCalc.determineSize(item.dimensions, item.weight)
    return Promise.resolve(assert.equal(size, item.size));
  })
});