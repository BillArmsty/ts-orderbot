import { Router } from 'express';
import { placeOrder } from '../../controllers/placeOrder';


const router = Router();

router.post('/private/linear/order/create', placeOrder);

export { router as placeOrderRouter}