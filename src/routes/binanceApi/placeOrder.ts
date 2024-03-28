import { Router } from "express";
import { placeOrderBinance } from "../../controllers/binanceControllers/placeOrder";

const router = Router();

router.post("/fapi/v1/order", placeOrderBinance);

export { router as placeOrderRouterBinance };
