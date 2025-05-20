// Import required modules
import { Router } from 'express'; // Express router for creating modular route handlers
import { packageController } from '../controllers/packageController'; // Import package controller methods

// Create an Express router instance
const router = Router();

/**
 * Package Management Routes
 * 
 * These routes handle all package-related operations including:
 * - Creating new packages (both one-day and two-day shipping)
 * - Retrieving package information
 * - Updating package status
 * - Listing packages with filters
 * - Deleting packages
 */

// Create a new one-day shipping package
router.post('/packages/one-day', packageController.createOneDay);

// Create a new two-day shipping package
router.post('/packages/two-day', packageController.createTwoDay);

// Get package details by tracking number
router.get('/packages/:trackingNumber', packageController.getPackage);

// Update package status
router.put('/packages/status', packageController.updateStatus);

// Get paginated list of packages with optional filters
router.get('/packages', packageController.getPackages);

// Delete a package by tracking number
router.delete('/packages/:trackingNumber', packageController.deletePackage);

// Export the configured router
export default router;