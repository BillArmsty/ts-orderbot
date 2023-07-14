import { Router } from 'express';
import { historicalOrders } from '../../controllers/historicalOrders';

const router = Router();

router.get('/v5/order/history', historicalOrders);

export { router as historicalOrdersRouter}