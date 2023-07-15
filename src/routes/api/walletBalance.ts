import { Router } from 'express';
import { walletBalance } from '../../controllers/walletBalance';


const router = Router();

router.get('/v5/account/wallet-balance', walletBalance);

export { router as walletBalanceRouter}