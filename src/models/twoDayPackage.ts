import { Package } from './package';

export class TwoDay extends Package {
  constructor(
    senderName: string,
    senderAddress: string,
    receiverName: string,
    receiverAddress: string,
    weight: number,
    costPerUnitWeight: number,
    status: string,
    trackingNumber: string,
    private flatFee: number
  ) {
    super(
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      weight,
      'Two-Day',
      costPerUnitWeight,
      status,
      trackingNumber
    );
  }

  calculateCost(): number {
    return super.calculateCost() + this.flatFee;
  }

  setFlatFee(fee: number): void {
    this.flatFee = fee;
  }

  getFlatFee(): number {
    return this.flatFee;
  }
}