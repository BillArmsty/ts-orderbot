import { BasicSymbolParam, SymbolPrice, USDMClient } from "binance";
import { CONFIG } from "../config";

export class Binance {
  client: USDMClient;

  constructor(
    BINANCE_API_KEY: string,
    BINANCE_API_SECRET: string,
    useTestnet: true
  ) {
    this.client = new USDMClient({
      api_key: BINANCE_API_KEY,
      api_secret: BINANCE_API_SECRET,
    });
     useTestnet;
  }

  //Get Price
  getPrice = async (
    params: BasicSymbolParam
  ): Promise<SymbolPrice | SymbolPrice[]> => {
    try {
      const result = await this.client.getSymbolPriceTicker(params);
      return result;
    } catch (error) {
      console.log(`Error getting price: ${error}`);
    }
    return [];
  };
}
