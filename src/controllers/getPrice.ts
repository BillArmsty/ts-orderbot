import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function getPrice(req: Request, res: Response) {
    try {
      const { category, symbol } = req.body;
  
      if (!category || !symbol) {
        return res.status(200).json({
          status: "failed",
          error:
            "Please specify the category and symbol",
        });
      }
      const bybit = new Bybit(
        CONFIG.BYBIT_API_KEY,
        CONFIG.BYBIT_API_SECRET,
        CONFIG.BYBIT_TESTNET === "true"
      );
  
      const latestPrice = await bybit.getPrice({
        symbol,
        category,

      });
      res.status(200).json({
        status: "success",
        message: "Latest price fetched successfully",
        
        data: latestPrice,
      })
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: "Error fetching latest price",
      });
    }
  }
  
  export { getPrice };