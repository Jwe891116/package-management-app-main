import { Request, Response } from 'express';
import { OneDay } from '../models/oneDayPackage';
import { TwoDay } from '../models/twoDayPackage';
import pool from '../db/db';

/**
 * Generates a random 6-digit tracking number
 * @returns {string} The generated tracking number
 */
const generateTrackingNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Helper function to create a package (either OneDay or TwoDay)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {typeof OneDay | typeof TwoDay} PackageClass - The package class to instantiate
 */
const createPackage = async (req: Request, res: Response, PackageClass: typeof OneDay | typeof TwoDay) => {
  try {
    // Destructure required fields from request body
    const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, flatFee } = req.body;
    
    // Create new package instance with provided data
    const packageInstance = new PackageClass(
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      weight,
      costPerUnitWeight,
      'Created', // Default status
      generateTrackingNumber(), // Generate unique tracking number
      flatFee
    );

    // Calculate total shipping cost
    const totalCost = packageInstance.calculateCost();

    // Insert package into database
    const result = await pool.query(
      `INSERT INTO packages (
        shipping_method, sender_name, receiver_name, sender_address, receiver_address,
        weight, cost_per_unit_weight, flat_fee, status, tracking_number, total_cost
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        packageInstance.shippingMethod,
        packageInstance.senderName,
        packageInstance.receiverName,
        packageInstance.senderAddress,
        packageInstance.receiverAddress,
        packageInstance.weight,
        packageInstance.costPerUnitWeight,
        packageInstance.flatFee,
        packageInstance.status,
        packageInstance.trackingNumber,
        totalCost
      ]
    );

    // Return success response with created package data
    res.status(201).json({
      package: result.rows[0],
      trackingNumber: result.rows[0].tracking_number
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const packageController = {
  /**
   * Creates a one-day delivery package
   */
  createOneDay: (req: Request, res: Response) => createPackage(req, res, OneDay),
  
  /**
   * Creates a two-day delivery package
   */
  createTwoDay: (req: Request, res: Response) => createPackage(req, res, TwoDay),
  
  /**
   * Gets a package by its tracking number
   */
  async getPackage(req: Request, res: Response) {
    try {
      // Query database for package with matching tracking number
      const result = await pool.query(
        'SELECT * FROM packages WHERE tracking_number = $1', 
        [req.params.trackingNumber]
      );
      
      // Return 404 if no package found
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }
      
      // Return found package
      res.json({ package: result.rows[0] });
    } catch (error) {
      console.error('Error getting package:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Updates a package's status
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const { trackingNumber, newStatus } = req.body;
      
      // Validate status against allowed values
      const validStatuses = ['Created', 'Shipped', 'In Transit', 'Delivered'];
      if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      // Update package status in database
      const result = await pool.query(
        'UPDATE packages SET status = $1 WHERE tracking_number = $2 RETURNING *',
        [newStatus, trackingNumber]
      );

      // Return 404 if no package found
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }
      
      // Return updated package
      res.json({ package: result.rows[0] });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Gets paginated list of packages with optional filters
   */
  async getPackages(req: Request, res: Response) {
    try {
      // Extract query parameters with default values
      const { status, shippingMethod, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      
      // Initialize base queries and parameters
      let baseQuery = 'SELECT * FROM packages';
      let countQuery = 'SELECT COUNT(*) FROM packages';
      const params = [];
      const conditions = [];
      
      // Add filter conditions if provided
      if (status) {
        conditions.push(`status = $${conditions.length + 1}`);
        params.push(status);
      }
      if (shippingMethod) {
        conditions.push(`shipping_method = $${conditions.length + 1}`);
        params.push(shippingMethod);
      }
      
      // Add WHERE clause if filters exist
      if (conditions.length) {
        const whereClause = ` WHERE ${conditions.join(' AND ')}`;
        baseQuery += whereClause;
        countQuery += whereClause;
      }
      
      // Add pagination to base query
      baseQuery += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(Number(limit), offset);

      // Execute both queries in parallel
      const [result, countResult] = await Promise.all([
        pool.query(baseQuery, params),
        pool.query(countQuery, params.slice(0, -2)) // Exclude pagination params from count query
      ]);

      // Calculate pagination metadata
      const totalCount = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(totalCount / Number(limit));

      // Return paginated results
      res.json({ 
        packages: result.rows,
        pagination: {
          totalPages,
          currentPage: Number(page),
          totalCount
        }
      });
    } catch (error) {
      console.error('Error getting packages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Deletes a package by its tracking number
   */
  async deletePackage(req: Request, res: Response) {
    try {
      // Delete package from database
      const result = await pool.query(
        'DELETE FROM packages WHERE tracking_number = $1 RETURNING *',
        [req.params.trackingNumber]
      );
      
      // Return 404 if no package found
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }
      
      // Return deleted package data
      res.json({ deletedPackage: result.rows[0] });
    } catch (error) {
      console.error('Error deleting package:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};