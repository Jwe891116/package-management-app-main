export interface IPackage {
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  weight: number;
  shippingMethod: string;
  costPerUnitWeight: number;
  status: string;
  trackingNumber: string;
  calculateCost(): number;
}