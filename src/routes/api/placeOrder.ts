import { Router } from 'express';
import { placeOrder } from '../../controllers/placeOrder';


const router = Router();

router.post('/v5/order/create', placeOrder);

export { router as placeOrderRouter}