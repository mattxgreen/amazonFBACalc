# Amazon FBA Fee Calculator
Promisified Amazon fee calculator
### Usage:
```
const options = {
  feeLogging: false
}
const FeeCalc = require('fbacalc').FeeCalc;
const feeCalculator = new FeeCalc(options)
feeCalculator.calculateFee(10, 'Beauty', .02, [4.8, .9, .8] )
.then(fee => {
  console.log(fee);
})
```
### Options:
```
{
  inboundShippingPerPound: 1, // Dollar amount for inbound shipping price/lb
  feeLogging: true, // Debug console output
  maxLargeStandardWeight: 20,
  maxLargeStandardDimensions: [18, 14, 8],
  maxSmallStandardMediaWeight: 0.875,
  maxSmallStandardNonMediaWeight: 0.75,
  maxSmallStandardDimensions: [15, 12, 0.75],
  maxSmallOversizeWeight: 70,
  maxSmallOversizeDimensions: [60,30]
}
```

### Methods:
#### .calculateFee(cost, category, weight, [height, width, depth])

