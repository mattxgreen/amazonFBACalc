"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fees = require("../constants/category-fees");
var lodash_1 = require("lodash");
var sizeTiers_1 = require("./sizeTiers");
var FeeCalc = (function () {
    function FeeCalc(options) {
        this.options = {
            inboundShippingPerPound: 1,
            debug: true
        };
        this.options = lodash_1.merge(this.options, options);
    }
    FeeCalc.prototype.calculateAllFees = function (price, category, weight, dimensions) {
        var _this = this;
        return new Promise(function (resolve) {
            var isMedia = false;
            var size;
            var feeTotal = 0;
            var dimWeight = _this.getDimensionalWeight(dimensions);
            weight = dimWeight > weight ? dimWeight : weight;
            isMedia = category in fees.variableClosingFee;
            size = _this.determineSize(dimensions, weight);
            feeTotal += _this.calculateFulfillmentFees(size, weight);
            feeTotal += _this.calculateThirtyDayStorage(dimensions, size);
            resolve(parseFloat(feeTotal.toFixed(2)));
        });
    };
    FeeCalc.prototype.calculateFBAFees = function (price, category, weight, dimensions) {
        var _this = this;
        return new Promise(function (resolve) {
            var isMedia = false;
            var size;
            var feeTotal = 0;
            var dimWeight = _this.getDimensionalWeight(dimensions);
            weight = dimWeight > weight ? dimWeight : weight;
            isMedia = category in fees.variableClosingFee;
            size = _this.determineSize(dimensions, weight);
            feeTotal += _this.calculateFulfillmentFees(size, weight);
            feeTotal += _this.calculateThirtyDayStorage(dimensions, size);
            resolve(parseFloat(feeTotal.toFixed(2)));
        });
    };
    FeeCalc.prototype.determineSize = function (dimensions, weight) {
        var size;
        dimensions = dimensions.sort(function (a, b) { return a - b; });
        var shortest = dimensions[0], median = dimensions[1], longest = dimensions[2];
        var tiersBigToSmall = Object.keys(sizeTiers_1.TIERS).reverse();
        size = tiersBigToSmall.reduce(function (p, tier) {
            if (shortest <= sizeTiers_1.TIERS[tier].shortest &&
                median <= sizeTiers_1.TIERS[tier].median &&
                longest <= sizeTiers_1.TIERS[tier].longest &&
                weight <= sizeTiers_1.TIERS[tier].weight) {
                p = tier;
            }
            return p;
        }, '');
        return size;
    };
    FeeCalc.prototype.calculateFulfillmentFees = function (size, weight) {
        var price = 0;
        switch (size) {
            case 'smallStandard':
                price = 2.41;
                break;
            case 'largeStandard':
                price = weight <= 1 ? 3.19 :
                    weight <= 2 ? 4.71 :
                        4.71 + (weight - 2) * 0.38;
                break;
            case 'smallOver':
                price = 8.13 + Math.ceil(weight - 1) * .38;
                break;
            case 'mediumOver':
                price = 9.44 + Math.ceil(weight - 1) * .38;
                break;
            case 'largeOver':
                price = 73.18 + Math.ceil(weight - 1) * .79;
                break;
        }
        return parseFloat(price.toFixed(2));
    };
    FeeCalc.prototype.calculateReferralFee = function (price, category) {
        var flatFee = 0;
        var percentageFee = 0;
        var referralFee = 0;
        if (category in fees.percentageFee) {
            flatFee = fees.minimumFee[category];
            percentageFee = fees.percentageFee[category] / 100;
        }
        else {
            flatFee = fees.minimumFee["Everything Else"];
            percentageFee = fees.percentageFee["Everything Else"] / 100;
        }
        if ((percentageFee * price) < flatFee) {
            referralFee += flatFee;
        }
        else {
            referralFee += price * percentageFee;
        }
        return referralFee;
    };
    FeeCalc.prototype.calculateVariableReferralFee = function (category) {
        var variableClosingFee = 0;
        if (category in fees.variableClosingFee) {
            variableClosingFee = fees.variableClosingFee[category];
        }
        return variableClosingFee;
    };
    FeeCalc.prototype.getDimensionalWeight = function (dimensions) {
        var total = dimensions.reduce(function (a, dim) { return dim * a; }, 1);
        return (total / 139.0).toFixed(2);
    };
    FeeCalc.prototype.calculateThirtyDayStorage = function (dimensions, size) {
        var storageFee = 0;
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var cubicFeet = (dimensions[0] / 12) * (dimensions[1] / 12) * (dimensions[2] / 12);
        if (currentMonth >= 0 && currentMonth <= 9) {
            storageFee = /Over/i.test(size) ? (.48 * cubicFeet) : (.69 * cubicFeet);
        }
        else {
            storageFee = /Over/i.test(size) ? (1.2 * cubicFeet) : (2.4 * cubicFeet);
        }
        storageFee = parseFloat(storageFee.toFixed(2));
        storageFee = storageFee || 0.01;
        return storageFee;
    };
    return FeeCalc;
}());
exports.default = FeeCalc;
;
