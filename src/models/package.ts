import { IPackage } from "../interfaces/iPackage";

export class Package implements IPackage {
  constructor(
    public senderName: string,
    public senderAddress: string,
    public receiverName: string,
    public receiverAddress: string,
    public weight: number,
    public shippingMethod: string,
    public costPerUnitWeight: number,
    public status: string,
    public trackingNumber: string
  ) {}

  calculateCost(): number {
    return this.weight * this.costPerUnitWeight;
  }
}