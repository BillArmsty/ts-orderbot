import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function activeOrders(req: Request, res: Response) {
    try {
      const { category } = req.body;
      console.log(req.body);
      
  
      if (!category ) {
        return res.status(200).json({
          status: "failed",
          error:
            "Please specify the category ",
        });
      }
      const bybit = new Bybit(
        CONFIG.BYBIT_API_KEY,
        CONFIG.BYBIT_API_SECRET,
        CONFIG.BYBIT_TESTNET === "true"
      );
  
      const ordersActive = await bybit.activeOrders({
        category,
        

      });
      res.status(200).json(ordersActive);
      console.log(ordersActive);
      
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: "Error  getting active orders",
      });
    }
  }
  
  export { activeOrders };
  