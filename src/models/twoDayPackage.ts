import { Package } from './package';

/**
 * Two-Day Delivery Package Class
 * 
 * Represents a package with two-day delivery service.
 * Extends the base Package class to add two-day specific features
 * including a flat fee that's added to the standard weight-based cost.
 * 
 * Pricing Formula: (weight × costPerUnitWeight) + flatFee
 * 
 * Note: The flat fee for two-day is typically lower than one-day delivery.
 */
export class TwoDay extends Package {
  /**
   * Creates a new TwoDay package instance
   * @param senderName - Name of the sender (max 100 chars)
   * @param senderAddress - Complete sender address
   * @param receiverName - Name of the recipient (max 100 chars)
   * @param receiverAddress - Complete recipient address
   * @param weight - Package weight in kg (0.1-25kg range)
   * @param costPerUnitWeight - Base cost per kg (must be >= 0)
   * @param status - Initial status ('Created', 'Shipped', etc.)
   * @param trackingNumber - Unique 6-digit tracking identifier
   * @param flatFee - Fixed fee for two-day service (typically $3-8)
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
      'Two-Day', // Fixed shipping method
      costPerUnitWeight,
      status,
      trackingNumber
    );
  }

  /**
   * Calculates the total shipping cost
   * Combines the standard weight-based cost with the two-day flat fee
   * @returns Total shipping cost rounded to 2 decimal places
   * @override Package.calculateCost()
   */
  calculateCost(): number {
    const baseCost = super.calculateCost();
    const total = baseCost + this.flatFee;
    return parseFloat(total.toFixed(2)); // Ensure proper currency formatting
  }

  /**
   * Updates the two-day flat fee amount
   * @param fee - New flat fee amount (2.50-8.00 typical range)
   * @throws {Error} If fee is negative or exceeds reasonable maximum
   */
  setFlatFee(fee: number): void {
    if (fee < 0) {
      throw new Error('Flat fee cannot be negative');
    }
    if (fee > 15) {
      throw new Error('Flat fee exceeds maximum allowed');
    }
    this.flatFee = parseFloat(fee.toFixed(2)); // Ensure proper currency format
  }

  /**
   * Gets the current two-day flat fee
   * @returns Current flat fee amount
   */
  getFlatFee(): number {
    return this.flatFee;
  }
}