// Import the interface that this class implements
import { IPackage } from "../interfaces/iPackage";

/**
 * Base Package Class
 * 
 * Implements the core functionality for all package types.
 * Provides the fundamental properties and methods required by the IPackage interface.
 * 
 * This serves as the parent class for specialized package types (OneDay, TwoDay, etc.)
 * and implements the standard weight-based cost calculation.
 */
export class Package implements IPackage {
  /**
   * Creates a new Package instance
   * @param senderName - Name of the sender/originator
   * @param senderAddress - Complete sender mailing address
   * @param receiverName - Name of the recipient
   * @param receiverAddress - Complete recipient mailing address
   * @param weight - Package weight in kilograms (must be positive)
   * @param shippingMethod - Type of shipping service
   * @param costPerUnitWeight - Cost per kilogram (must be non-negative)
   * @param status - Current delivery status
   * @param trackingNumber - Unique package identifier
   */
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

  /**
   * Calculates the base shipping cost based on weight
   * Implements the standard formula: weight × costPerUnitWeight
   * @returns The calculated shipping cost
   * @throws {Error} If weight or costPerUnitWeight is invalid
   */
  calculateCost(): number {
    // Validate inputs before calculation
    if (this.weight <= 0) {
      throw new Error('Weight must be greater than zero');
    }
    if (this.costPerUnitWeight < 0) {
      throw new Error('Cost per unit weight cannot be negative');
    }

    return this.weight * this.costPerUnitWeight;
  }
}