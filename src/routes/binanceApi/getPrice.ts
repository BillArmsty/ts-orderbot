import { Router } from 'express';
import { getPriceBinance } from '../../controllers/binanceControllers/getPrice';

const router = Router();

router.get('/fapi/v1/ticker/price', getPriceBinance);

export { router as getPriceRouterBinance}