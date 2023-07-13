import { Router } from 'express';
import { getPrice } from '../../controllers/getPrice';

const router = Router();

router.get('/v5/market/tickers', getPrice);

export { router as getPriceRouter}