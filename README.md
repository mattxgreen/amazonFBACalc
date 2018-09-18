# Amazon FBA Fee Calculator
Promisified Amazon fee calculator
### Usage:
```
const options = {
  debug: false
}
const FeeCalc = require('fbacalc').FeeCalc;
const feeCalculator = new FeeCalc(options)
feeCalculator.calculateFBAFees(10, .02, [4.8, .9, .8] )
.then(fee => {
  console.log(fee);
})
```
### Options:
```
{
  debug: bool
}
```

### Methods:
#### .calculateFee(cost, category, weight, [height, width, depth])

