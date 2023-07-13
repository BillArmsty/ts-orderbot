import { Router } from 'express';
import { cancelOrder } from '../../controllers/cancelOrder';


const router = Router();

router.post('/v5/order/cancel', cancelOrder);

export { router as cancelOrderRouter}