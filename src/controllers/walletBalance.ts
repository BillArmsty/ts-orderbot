import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { Request, Response } from "express";

async function walletBalance(req: Request, res: Response) {
  try {
    const { accountType, coin } = req.body;

    if (!accountType || !coin) {
      return res.status(200).json({
        status: "failed",
        error: "Please specify the accountType and coin",
      });
    }
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );

    const balance = await bybit.walletBalance({
      accountType,
        coin,
    });
    res.status(200).json({
      status: "success",
      message: "Wallet balance fetched successfully",
      data: balance,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: "Error fetching wallet balance",
    });
  }
}

export { walletBalance };
