import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function placeOrder(req: Request, res: Response) {
  try {
    const { side, symbol, qty, orderType, price } = req.body;

    if (!side || !symbol || !qty || !orderType || !price) {
      return res.status(200).json({
        status: "failed",
        error:
          "Please specify the side, symbol, quantity, price and order type",
      });
    }
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );

    const orderPlaced = await bybit.placeOrder({
      category: "linear",
      side,
      symbol,
      qty,
      orderType,
      price,
      timeInForce: "GTC",
      reduceOnly: false,
      closeOnTrigger: false,
    });
    res.status(200).json({
      status: "success",
      message: "Order placed successfully",
      data: orderPlaced,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: "Error placing order",
    });
  }
}

export { placeOrder };
