"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoDayPackage = void 0;
// src/models/TwoDay.ts
const Package_1 = require("./Package");
class TwoDayPackage extends Package_1.Package {
    constructor(senderName, senderAddress, receiverName, receiverAddress, weight, shippingMethod, costPerUnitWeight, status, trackingNumber, flatFee) {
        super(senderName, senderAddress, receiverName, receiverAddress, weight, shippingMethod, costPerUnitWeight, status, trackingNumber);
        this.senderName = senderName;
        this.senderAddress = senderAddress;
        this.receiverName = receiverName;
        this.receiverAddress = receiverAddress;
        this.weight = weight;
        this.shippingMethod = shippingMethod;
        this.costPerUnitWeight = costPerUnitWeight;
        this.status = status;
        this.trackingNumber = trackingNumber;
        this.flatFee = flatFee;
    }
    calculateCost() {
        return this.weight * this.costPerUnitWeight + this.flatFee;
    }
    setFlatFee(flatFee) {
        if (flatFee < 0) {
            throw new Error('Flat fee cannot be negative');
        }
        this.flatFee = flatFee;
    }
    getFlatFee() {
        return this.flatFee;
    }
}
exports.TwoDayPackage = TwoDayPackage;
