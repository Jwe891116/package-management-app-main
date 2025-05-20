// Import the base Package class that this class extends
import { Package } from './package';

/**
 * One-Day Delivery Package Class
 * 
 * Represents a package with expedited one-day delivery service.
 * Extends the base Package class to add one-day specific features
 * including a flat fee that's added to the standard weight-based cost.
 * 
 * Pricing Formula: (weight × costPerUnitWeight) + flatFee
 */
export class OneDay extends Package {
  /**
   * Creates a new OneDay package instance
   * @param senderName - Name of the sender
   * @param senderAddress - Complete sender address
   * @param receiverName - Name of the recipient
   * @param receiverAddress - Complete recipient address
   * @param weight - Package weight in kg (must be > 0)
   * @param costPerUnitWeight - Cost per kg (must be >= 0)
   * @param status - Initial delivery status
   * @param trackingNumber - Unique package identifier
   * @param flatFee - Fixed fee for one-day service (must be >= 0)
   */
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
      'One-Day', // Hardcoded shipping method
      costPerUnitWeight,
      status,
      trackingNumber
    );
  }

  /**
   * Calculates the total shipping cost for one-day delivery
   * @returns Total cost as (weight × unit cost) + flat fee
   * @override - Extends base package cost calculation
   */
  calculateCost(): number {
    // Get base cost from parent class and add one-day premium
    return super.calculateCost() + this.flatFee;
  }

  /**
   * Updates the one-day delivery flat fee
   * @param fee - New flat fee amount (must be >= 0)
   * @throws {Error} If fee is negative
   */
  setFlatFee(fee: number): void {
    if (fee < 0) {
      throw new Error('Flat fee cannot be negative');
    }
    this.flatFee = fee;
  }

  /**
   * Gets the current one-day delivery flat fee
   * @returns Current flat fee amount
   */
  getFlatFee(): number {
    return this.flatFee;
  }
}