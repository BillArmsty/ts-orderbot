import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function cancelAllOrders(req: Request, res: Response) {
    try {
      const { category, symbol } = req.body;
  
      if (!category || !symbol ) {
        return res.status(200).json({
          status: "failed",
          error: "Please specify the category and symbol ",
        });
      }
      const bybit = new Bybit(
        CONFIG.BYBIT_API_KEY,
        CONFIG.BYBIT_API_SECRET,
        CONFIG.BYBIT_TESTNET === "true"
      );
  
      const ordersCancelled = await bybit.cancelAllOrders({
        symbol,
        category,

      });
      res.status(200).json({
        status: "success",
        message: "Orders cancelled successfully",
        
        data: ordersCancelled,
      })

      
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: "Error cancelling orders",
      });
    }
  }
  
  export { cancelAllOrders };