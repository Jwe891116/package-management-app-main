import { Router } from 'express';
import { packageController } from '../controllers/packageController';

const router = Router();

router.post('/packages/one-day', packageController.createOneDay);
router.post('/packages/two-day', packageController.createTwoDay);
router.get('/packages/:trackingNumber', packageController.getPackage);
router.put('/packages/status', packageController.updateStatus);
router.get('/packages', packageController.getPackages);
router.delete('/packages/:trackingNumber', packageController.deletePackage);

export default router;