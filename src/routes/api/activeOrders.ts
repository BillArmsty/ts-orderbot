import { Router } from 'express';
import { activeOrders } from '../../controllers/activeOrders';


const router = Router();

router.get('/v5/order/realtime', activeOrders);

export { router as activeOrdersRouter}