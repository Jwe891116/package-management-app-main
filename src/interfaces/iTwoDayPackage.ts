// Import the base package interface that this interface extends
import { IPackage } from './iPackage';

/**
 * Two-Day Delivery Package Interface
 * 
 * Extends the base IPackage interface to add two-day delivery specific
 * properties and methods. This ensures all two-day packages implement
 * both standard package features and two-day specific features.
 * 
 * Differs from IOneDay in typically having a lower flat fee but
 * longer delivery timeframe.
 */
export interface ITwoDay extends IPackage {
  /**
   * The flat fee amount for two-day delivery service
   * This is typically lower than one-day delivery fees
   * @minimum 0 - Fee cannot be negative
   * @example 5.99 - Standard two-day flat fee
   */
  flatFee: number;

  /**
   * Updates the flat fee amount for two-day delivery
   * @param fee - The new flat fee amount (must be non-negative)
   * @throws {Error} If fee is negative
   */
  setFlatFee(fee: number): void;

  /**
   * Retrieves the current flat fee amount
   * @returns The current flat fee value
   * @example 5.99 - Returns the set flat fee
   */
  getFlatFee(): number;

  /**
   * Inherited from IPackage:
   * - All standard package properties (sender, receiver, weight, etc.)
   * - calculateCost() method (implementation should combine flat fee with weight-based cost)
   * - trackingNumber and status fields
   */
}