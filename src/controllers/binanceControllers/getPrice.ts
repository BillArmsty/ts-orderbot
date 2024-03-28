import { CONFIG } from "../../config/config";
import { Binance } from "../../exchange";
import { Request, Response } from "express";

async function getPriceBinance(req: Request, res: Response) {
  try {
    const { symbol } = req.body;
    
    console.log(req.body);
    

    // if (!symbol) {
    //   return res.status(200).json({
    //     status: "failed",
    //     error: "Please specify the symbol",
    //   });
    // }
    const binance = new Binance(
      CONFIG.BINANCE_API_KEY,
      CONFIG.BINANCE_API_SECRET,
      true
    );

    const latestPrice = await binance.getPrice({
      symbol
    });
    res.status(200).json({
      status: "success",
      message: "Latest price fetched successfully",

      data: latestPrice,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: "Error fetching latest price",
    });
  }
}

export { getPriceBinance };
