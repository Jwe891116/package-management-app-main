"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneDayPackage = void 0;
// src/models/OneDay.ts
const Package_1 = require("./Package");
class OneDayPackage extends Package_1.Package {
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
    getSenderName() {
        throw new Error("Method not implemented.");
    }
    getSenderAddress() {
        throw new Error("Method not implemented.");
    }
    getReceiverAddress() {
        throw new Error("Method not implemented.");
    }
    getWeight() {
        throw new Error("Method not implemented.");
    }
    getShippingMethod() {
        throw new Error("Method not implemented.");
    }
    getCostPerUnitWright() {
        throw new Error("Method not implemented.");
    }
    getStatus() {
        throw new Error("Method not implemented.");
    }
    getTrackingNumber() {
        throw new Error("Method not implemented.");
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
exports.OneDayPackage = OneDayPackage;
