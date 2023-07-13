// import { Request, Response } from "express";
// import { CONFIG } from "../config/config";
// import { Bybit } from "../exchange/bybit";

// async function getPrice(req: Request, res: Response) {
//   try {
//     let bybit = new Bybit(
//       CONFIG.BYBIT_API_KEY,
//       CONFIG.BYBIT_API_SECRET,
//       CONFIG.BYBIT_TESTNET === "true"
//     );
//     const ethPrice: any = await bybit.getPrice("ETHUSDT");
//     const btcPrice: any = await bybit.getPrice("BTCUSDT");
//     const solPrice: any = await bybit.getPrice("SOLUSDT");

//     const data = [
//       {
//         symbol: "ETHUSDT",
//         price: ethPrice,
//       },
//       {
//         symbol: "BTCUSDT",
//         price: btcPrice,
//       },
//       {
//         symbol: "SOLUSDT",
//         price: solPrice,
//       },
//     ];
//     return res.status(200).json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     res.status(200).json({
//       success: false,
//       error: error.message,
//     });
//   }
// }

// export { getPrice };
