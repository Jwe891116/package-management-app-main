/**
 * Base Package Interface
 * 
 * Defines the core properties and methods that all package types must implement.
 * This serves as the foundation for specialized package interfaces (like IOneDay, ITwoDay).
 * 
 * Follows the Interface Segregation Principle by keeping the contract minimal and focused.
 */
export interface IPackage {
  /**
   * Name of the sender/originator of the package
   * @example "Acme Corporation"
   */
  senderName: string;

  /**
   * Complete physical address of the sender
   * @example "123 Main St, Anytown, USA"
   */
  senderAddress: string;

  /**
   * Name of the package recipient
   * @example "John Doe"
   */
  receiverName: string;

  /**
   * Complete physical address of the recipient
   * @example "456 Oak Ave, Somewhere, USA"
   */
  receiverAddress: string;

  /**
   * Package weight in kilograms
   * Must be a positive number
   * @minimum 0.1
   * @example 2.5 (for 2.5 kg)
   */
  weight: number;

  /**
   * Shipping service type/classification
   * Should match one of the valid shipping methods
   * @example "Standard", "Express"
   */
  shippingMethod: string;

  /**
   * Cost per unit weight (price per kg)
   * Used in cost calculations along with weight
   * @minimum 0
   * @example 1.25 (for $1.25 per kg)
   */
  costPerUnitWeight: number;

  /**
   * Current delivery status
   * Should be one of: 'Created', 'Shipped', 'In Transit', 'Delivered'
   * @default 'Created'
   */
  status: string;

  /**
   * Unique package identifier
   * Typically auto-generated in format: XXXXXX (6 digits)
   * @pattern ^\d{6}$
   */
  trackingNumber: string;

  /**
   * Calculates the total shipping cost
   * Implementation varies by package type (flat fee, weight-based, etc.)
   * @returns The calculated total cost as a number
   * @example 15.75 (for $15.75 total cost)
   */
  calculateCost(): number;
}