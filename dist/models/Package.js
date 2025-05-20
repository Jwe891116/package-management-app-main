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
    getReceiverName() {
        throw new Error("Method not implemented.");
    }
    printLabel() {
        console.log(`Sender: ${this.senderName}, ${this.senderAddress}`);
        console.log(`Receiver: ${this.receiverName}, ${this.receiverAddress}`);
        console.log(`Weight: ${this.weight} kg`);
        console.log(`Shipping Method: ${this.shippingMethod}`);
        console.log(`Status: ${this.status}`);
        console.log(`Tracking Number: ${this.trackingNumber}`);
    }
    updateStatus(newStatus) {
        if (!['Pending', 'In Transit', 'Delivered', 'Cancelled'].includes(newStatus)) {
            throw new Error('Invalid status');
        }
        this.status = newStatus;
    }
}
exports.Package = Package;
