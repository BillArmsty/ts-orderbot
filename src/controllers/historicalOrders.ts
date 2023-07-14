import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function historicalOrders(req: Request, res: Response) {
    try {
      const { category } = req.body;
  
      if (!category ) {
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
  
      const historicalOrders = await bybit.historicalOrders({
        category,

      });
      res.status(200).json({
        status: "success",
        message: "Historical Orders fetched successfully",
        
        data: historicalOrders,
      })
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: " Error fetching historical orders",
      });
    }
  }
  
  export { historicalOrders };