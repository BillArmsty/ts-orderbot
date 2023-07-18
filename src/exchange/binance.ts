import {
  BasicSymbolParam,
  SymbolPrice,
  USDMClient,
  numberInString,
} from "binance";
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
  ): Promise<SymbolPrice[] | SymbolPrice> => {
    try {
      const result = await this.client.getSymbolPriceTicker(params);

      if (Array.isArray(result)) {
        const symbolPrices: SymbolPrice[] = result.map(
          (symbolPrice: SymbolPrice) => {
            return {
              symbol: symbolPrice.symbol,
              price: parseFloat(symbolPrice.price.toString()),
            
            };
          }
        );

        return symbolPrices;
      } else {
        const price: number = parseFloat(result.price.toString()); // Accessing the 'price' property directly
        console.log(result.symbol, price);
        

        // You can use the 'price' value here for further processing if needed

        return result; // Return the entire 'SymbolPrice' object if necessary
      }
    } catch (error) {
      console.log(`Error getting price: ${error}`);
    }
    return [];
  };
}
