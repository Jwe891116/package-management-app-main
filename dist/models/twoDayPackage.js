"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoDay = void 0;
const package_1 = require("./package");
class TwoDay extends package_1.Package {
    constructor(senderName, senderAddress, receiverName, receiverAddress, weight, costPerUnitWeight, status, trackingNumber, flatFee) {
        super(senderName, senderAddress, receiverName, receiverAddress, weight, 'Two-Day', costPerUnitWeight, status, trackingNumber);
        this.flatFee = flatFee;
    }
    calculateCost() {
        return super.calculateCost() + this.flatFee;
    }
    setFlatFee(fee) {
        this.flatFee = fee;
    }
    getFlatFee() {
        return this.flatFee;
    }
}
exports.TwoDay = TwoDay;
