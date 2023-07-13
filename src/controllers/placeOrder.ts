import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";




 async function placeOrder  (req: Request, res: Response) {
    try {
    const { side, symbol, qty, order_type } = req.body;
    console.log("side", side, "symbol", symbol, "qty", qty, "order_type", order_type);
    
    if (!side || !symbol || !qty || !order_type) {
      return res.status(200).json({
        status: "failed",
        error: "Please specify the side, symbol, quantity and order type",
      });
    }
    const bybit = new Bybit(
        CONFIG.BYBIT_API_KEY,
        CONFIG.BYBIT_API_SECRET,
        CONFIG.BYBIT_TESTNET === "true"
        );


      const orderPlaced = await bybit.placeOrder({
        side,
        symbol,
        order_type: order_type || "Market",
        qty,
        time_in_force: "GoodTillCancel",
        reduce_only: false,
        close_on_trigger: false,
       
      });
      res.status(200).json(orderPlaced);
    } catch (error) {
      console.log("Error placing order", error);
    }
  };

    export {placeOrder}