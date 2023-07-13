import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function cancelOrder(req: Request, res: Response) {
    try {
      const { category, symbol, orderId } = req.body;
  
      if (!category || !symbol || !orderId) {
        return res.status(200).json({
          status: "failed",
          error:
            "Please specify the category, symbol and order id",
        });
      }
      const bybit = new Bybit(
        CONFIG.BYBIT_API_KEY,
        CONFIG.BYBIT_API_SECRET,
        CONFIG.BYBIT_TESTNET === "true"
      );
  
      const orderCancelled = await bybit.cancelOrder({
        symbol,
        orderId,
        category,

      });
      res.status(200).json({
        status: "success",
        message: "Order cancelled successfully",
        
        data: orderCancelled,
      })
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: "Error cancelling order",
      });
    }
  }
  
  export { cancelOrder };