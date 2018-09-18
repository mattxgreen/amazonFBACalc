import { feePercent, feeMin, variableClosingFee } from './fees';
import { TIERS } from './sizeTiers';
import { merge } from 'lodash';

// takes the price of the product, weight and dimensions and determines how much will be paid after fees
export class FeeCalc {
  options = {
    inboundShippingPerPound: 1,
    debug: true
  }
  constructor(options){
    // merge options
    this.options = merge(this.options, options);
  }
  public calculateAllFees(price, category, weight, dimensions){
    return new Promise(resolve => {
      const isMedia = category in variableClosingFee;
      const size = this.determineSize(dimensions, weight);
      let feeTotal = 0;
      const dimWeight = this.getDimensionalWeight(dimensions);
      // Use largest of unit weight/dimensional weight
      weight = dimWeight > weight ? dimWeight : weight;
      // feeTotal = this.calculateReferralFee(price, category);
      // feeTotal += this.calculateVariableReferralFee(category);
      feeTotal += this.calculateFulfillmentFees(size, weight);
      feeTotal += this.calculateStorage(dimensions, size);
      resolve(parseFloat(feeTotal.toFixed(2)));
    })
  }
  public calculateFBAFee(dimensions, weight){
    return new Promise(resolve => {
      var size;
      var feeTotal = 0;
      const dimWeight = this.getDimensionalWeight(dimensions);
      // Use largest of unit weight/dimensional weight
      weight = dimWeight > weight ? dimWeight : weight;
      size = this.determineSize(dimensions, weight);
      feeTotal += this.calculateFulfillmentFees(size, weight);
      feeTotal += this.calculateStorage(dimensions, size);
      resolve(parseFloat(feeTotal.toFixed(2)));
    })
  }
  public determineSize(dimensions, weight){
    // return new Promise(resolve => {
      let size;
      dimensions = dimensions.sort((a,b) => a-b); // ascending
      const shortest = dimensions[0],
        median = dimensions[1],
        longest = dimensions[2];
        const tiersBigToSmall = Object.keys(TIERS).reverse();
        size = tiersBigToSmall.reduce( (p, tier) => {
          if(
            shortest <= TIERS[tier].shortest &&
            median <= TIERS[tier].median &&
            longest <= TIERS[tier].longest &&
            weight <= TIERS[tier].weight
          ){
            p = tier;
          }
          return p;
        }, '')
      return size;
  }
  public calculateFulfillmentFees(size, weight){
    let price = 0;
    switch(size){
      case 'smallStandard':
        price = 2.41;
        break;
      case 'largeStandard':
        price = weight <=1 ? 3.19:
          weight<=2 ? 4.71 :
          4.71 + (weight-2) * 0.38;
        break;
      case 'smallOver':
        price = 8.13 + Math.ceil(weight-1) *.38; // 1 lb of packaging weight
        break;
      case 'mediumOver':
        price = 9.44 + Math.ceil(weight-1) *.38; // 1 lb of packaging weight
        break;
      case 'largeOver':
        price = 73.18 + Math.ceil(weight-1) *.79; // 1 lb of packaging weight
        break;
    }
    return parseFloat(price.toFixed(2));
  }
  private calculateReferralFee(price, category) {
    var flatFee = 0;
    var percentageFee = 0;
    var referralFee = 0;

    // check if category is in fees
    if (category in feePercent) {
      flatFee = feeMin[category];
      percentageFee = feePercent[category] / 100;
    } else {
      flatFee = feeMin["Everything Else"];
      percentageFee = feePercent["Everything Else"] / 100;
    }

    if ((percentageFee * price) < flatFee) {
      referralFee += flatFee;
    } else {
      referralFee += price * percentageFee;
    }
    return referralFee;
  }
  private calculateVariableReferralFee (category) {
    return variableClosingFee[category] || 0;
  }
  private getDimensionalWeight(dimensions: number[]) {
    const total = dimensions.reduce((a, dim) => dim*a, 1)
    return (total / 139.0).toFixed(2);
  }

  private calculateStorage(dimensions, size) {
    var storageFee = 0;
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var cubicFeet = (dimensions[0] / 12) * (dimensions[1] / 12) * (dimensions[2] / 12);
    if (currentMonth >= 0 && currentMonth <= 9) {
      storageFee = /Over/i.test(size) ? (.48 * cubicFeet):(.69 * cubicFeet);
    } else {
      storageFee = /Over/i.test(size) ? (1.2 * cubicFeet):(2.4 * cubicFeet);
    }
    storageFee = parseFloat(storageFee.toFixed(2));
    // Minimum fee $0.01
    storageFee = storageFee || 0.01;
    return storageFee;
  }
};