# Amazon FBA Fee Calculator
Promisified Amazon fee calculator
### Usage:
```
const options = {
  debug: false
}
const FeeCalc = require('fbacalc').FeeCalc;
const feeCalculator = new FeeCalc(options)
const dimensions = [4.8, .9, .8];
const weightInLbs = 1.5;
feeCalculator.calculateFBAFees(dimensions, weightInLbs)
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
#### .calculateFBAFees([height, width, depth], weightInLbs)

