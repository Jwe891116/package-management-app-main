"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageController = void 0;
const oneDayPackage_1 = require("../models/oneDayPackage");
const twoDayPackage_1 = require("../models/twoDayPackage");
const db_1 = __importDefault(require("../db/db"));
const generateTrackingNumber = () => Math.floor(100000 + Math.random() * 900000).toString();
const createPackage = (req, res, PackageClass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, flatFee } = req.body;
        const packageInstance = new PackageClass(senderName, senderAddress, receiverName, receiverAddress, weight, costPerUnitWeight, 'Created', generateTrackingNumber(), flatFee);
        const totalCost = packageInstance.calculateCost();
        const result = yield db_1.default.query(`INSERT INTO packages (
        shipping_method, sender_name, receiver_name, sender_address, receiver_address,
        weight, cost_per_unit_weight, flat_fee, status, tracking_number, total_cost
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [
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
        ]);
        res.status(201).json({
            package: result.rows[0],
            trackingNumber: result.rows[0].tracking_number
        });
    }
    catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.packageController = {
    createOneDay: (req, res) => createPackage(req, res, oneDayPackage_1.OneDay),
    createTwoDay: (req, res) => createPackage(req, res, twoDayPackage_1.TwoDay),
    getPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query('SELECT * FROM packages WHERE tracking_number = $1', [req.params.trackingNumber]);
                if (result.rowCount === 0)
                    return res.status(404).json({ error: 'Package not found' });
                res.json({ package: result.rows[0] });
            }
            catch (error) {
                console.error('Error getting package:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trackingNumber, newStatus } = req.body;
                const validStatuses = ['Created', 'Shipped', 'In Transit', 'Delivered'];
                if (!validStatuses.includes(newStatus)) {
                    return res.status(400).json({ error: 'Invalid status' });
                }
                const result = yield db_1.default.query('UPDATE packages SET status = $1, updated_at = NOW() WHERE tracking_number = $2 RETURNING *', [newStatus, trackingNumber]);
                if (result.rowCount === 0)
                    return res.status(404).json({ error: 'Package not found' });
                res.json({ package: result.rows[0] });
            }
            catch (error) {
                console.error('Error updating status:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    getPackages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const [result, countResult] = yield Promise.all([
                    db_1.default.query(baseQuery, params),
                    db_1.default.query(countQuery, params.slice(0, -2))
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
            }
            catch (error) {
                console.error('Error getting packages:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    deletePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query('DELETE FROM packages WHERE tracking_number = $1 RETURNING *', [req.params.trackingNumber]);
                if (result.rowCount === 0)
                    return res.status(404).json({ error: 'Package not found' });
                res.json({ deletedPackage: result.rows[0] });
            }
            catch (error) {
                console.error('Error deleting package:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
};
