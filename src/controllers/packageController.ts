import { Request, Response } from 'express';
import { OneDay } from '../models/oneDayPackage';
import { TwoDay } from '../models/twoDayPackage';
import pool from '../db/db';

const generateTrackingNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

const createPackage = async (req: Request, res: Response, PackageClass: typeof OneDay | typeof TwoDay) => {
  try {
    const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, flatFee } = req.body;
    
    const packageInstance = new PackageClass(
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      weight,
      costPerUnitWeight,
      'Created',
      generateTrackingNumber(),
      flatFee
    );

    const totalCost = packageInstance.calculateCost();

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
  createOneDay: (req: Request, res: Response) => createPackage(req, res, OneDay),
  createTwoDay: (req: Request, res: Response) => createPackage(req, res, TwoDay),
  
  async getPackage(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM packages WHERE tracking_number = $1', [req.params.trackingNumber]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Package not found' });
      res.json({ package: result.rows[0] });
    } catch (error) {
      console.error('Error getting package:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { trackingNumber, newStatus } = req.body;
      const validStatuses = ['Created', 'Shipped', 'In Transit', 'Delivered'];
      
      if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await pool.query(
        'UPDATE packages SET status = $1, updated_at = NOW() WHERE tracking_number = $2 RETURNING *',
        [newStatus, trackingNumber]
      );

      if (result.rowCount === 0) return res.status(404).json({ error: 'Package not found' });
      res.json({ package: result.rows[0] });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getPackages(req: Request, res: Response) {
    try {
      const { status, shippingMethod, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      
      let baseQuery = 'SELECT * FROM packages';
      let countQuery = 'SELECT COUNT(*) FROM packages';
      const params = [];
      const conditions = [];
      
      if (status) {
        conditions.push(`status = $${conditions.length + 1}`);
        params.push(status);
      }
      if (shippingMethod) {
        conditions.push(`shipping_method = $${conditions.length + 1}`);
        params.push(shippingMethod);
      }
      
      if (conditions.length) {
        const whereClause = ` WHERE ${conditions.join(' AND ')}`;
        baseQuery += whereClause;
        countQuery += whereClause;
      }
      
      baseQuery += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(Number(limit), offset);

      const [result, countResult] = await Promise.all([
        pool.query(baseQuery, params),
        pool.query(countQuery, params.slice(0, -2))
      ]);

      const totalCount = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(totalCount / Number(limit));

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

  async deletePackage(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'DELETE FROM packages WHERE tracking_number = $1 RETURNING *',
        [req.params.trackingNumber]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Package not found' });
      res.json({ deletedPackage: result.rows[0] });
    } catch (error) {
      console.error('Error deleting package:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};