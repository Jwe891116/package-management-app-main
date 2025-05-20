// Import the base package interface that this interface extends
import { IPackage } from './iPackage';

/**
 * Interface for One-Day Delivery Packages
 * 
 * Extends the base IPackage interface to add one-day specific properties and methods
 * This ensures all one-day packages have both standard package features
 * and one-day specific features like a flat fee structure
 */
export interface IOneDay extends IPackage {
  /**
   * The flat fee amount for one-day delivery service
   * This is in addition to any weight-based costs
   */
  flatFee: number;

  /**
   * Sets the flat fee for one-day delivery
   * @param fee - The amount to set as the flat fee (must be positive number)
   */
  setFlatFee(fee: number): void;

  /**
   * Retrieves the current flat fee amount
   * @returns The current flat fee value
   */
  getFlatFee(): number;

  /**
   * Note: Inherits all members from IPackage interface including:
   * - senderName
   * - receiverName
   * - shippingMethod
   * - calculateCost()
   * - etc.
   */
}