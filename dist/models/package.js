"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
class Package {
    constructor(senderName, senderAddress, receiverName, receiverAddress, weight, shippingMethod, costPerUnitWeight, status, trackingNumber) {
        this.senderName = senderName;
        this.senderAddress = senderAddress;
        this.receiverName = receiverName;
        this.receiverAddress = receiverAddress;
        this.weight = weight;
        this.shippingMethod = shippingMethod;
        this.costPerUnitWeight = costPerUnitWeight;
        this.status = status;
        this.trackingNumber = trackingNumber;
    }
    calculateCost() {
        return this.weight * this.costPerUnitWeight;
    }
}
exports.Package = Package;
