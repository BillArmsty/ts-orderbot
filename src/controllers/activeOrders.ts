import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function activeOrders(req: Request, res: Response) {
    try {
      const { category,  symbol} = req.body;
      console.log(req.body);
      
  
      if (!category || !symbol) {
        return res.status(200).json({
          status: "failed",
          error: "Please specify the category and symbol",
        });
      }
      const bybit = new Bybit(
        CONFIG.BYBIT_API_KEY,
        CONFIG.BYBIT_API_SECRET,
        CONFIG.BYBIT_TESTNET === "true"
      );
  
      const ordersActive = await bybit.activeOrders({
        category,
        symbol,
        

      });
      res.status(200).json({
        status: "success",
        message: "Orders fetched successfully",
        data: ordersActive,
      })
      
      
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: "Error  getting active orders",
      });
    }
  }
  
  export { activeOrders };
  