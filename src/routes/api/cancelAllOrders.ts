import { Router } from 'express';
import { cancelAllOrders } from '../../controllers/cancelAllOrders';

const router = Router();

router.post('/v5/order/cancel-all', cancelAllOrders);

export { router as cancelAllOrdersRouter}