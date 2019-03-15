# Amazon FBA Fee Calculator
Promisified Amazon fee calculator
### Usage:
```
import { FeeCalc } from 'amazon-fba-calc';
const feeCalculator = new FeeCalc();
const dimensions = [4.8, .9, .8];
const weightInLbs = 1.5;
feeCalculator.calculateFBAFee(dimensions, weightInLbs)
.then(fee => {
  console.log(fee);
})
```

### Methods:
#### .calculateFBAFee([height, width, depth], weightInLbs)

