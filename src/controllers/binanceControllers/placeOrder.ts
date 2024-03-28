import BaseRestClient from "binance/lib/util/BaseRestClient";
import { CONFIG } from "../../config/config";
import { Binance } from "../../exchange";
import { Request, Response } from "express";

async function placeOrderBinance(req: Request, res: Response) {
  try {
    const { symbol, side, type, quantity, price } = req.body;
    // console.log(req.body);

    if (!side || !symbol || !quantity || !type || !price) {
      return res.status(200).json({
        status: "failed",
        error:
          "Please specify the side, symbol, quantity, price and order type",
      });
    }
    const binance = new Binance(
      CONFIG.BINANCE_API_KEY,
      CONFIG.BINANCE_API_SECRET,
      true
    );

    const newOrder = await binance.placeOrder({
      symbol,
      side,
      type,
      quantity,
      price,
      reduceOnly: "false",
      timeInForce: "GTC",
    });

    res.status(200).json({
      status: "success",
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: "Error placing order",
    });
  }
}

export { placeOrderBinance };
