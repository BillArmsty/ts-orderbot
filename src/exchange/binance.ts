import {
  BasicSymbolParam,
  NewFuturesOrderParams,
  NewOrderError,
  NewOrderResult,
  RestClient,
  RestClientOptions,
  SymbolPrice,
  USDMClient,
  numberInString,
} from "binance";
import { Order } from "../types";
import { CONFIG } from "../config";

export class Binance {
  client: USDMClient;

  constructor(
    BINANCE_API_KEY: string,
    BINANCE_API_SECRET: string,
    useTestnet: true
  ) {
    this.client = new USDMClient({
      api_key: BINANCE_API_KEY!,
      api_secret: BINANCE_API_SECRET!,
    });
    useTestnet ? "usdmtest" : "usdm";
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
        const price: number = parseFloat(result.price.toString());
        return {
          symbol: result.symbol,
          price,
        };
        
      }
      
    } catch (error) {
      console.log(`Error getting price: ${error}`);
    }
    return [];
  };

  //Make a order
  placeOrder = async (params: NewFuturesOrderParams): Promise<Order | null> => {
    try {
      let { symbol, side, type, quantity } = params;
      let price: any = await this.getPrice({ symbol });
      price = side === "BUY" ? price - 0.2 : price + 0.2;
      const result: any = await this.client.submitNewOrder({
        symbol,
        side,
        type,
        quantity,
        price,
      });
      console.log(result);

      if (result?.code) {
        console.log(`Error placing order: ${result.msg}`);
      } else if (result?.status === "new") {
        return result;
        // {
        //   id: result?.orderId,
        //   market: result?.symbol,
        //   side: result?.side,
        //   type: result?.type,
        //   price: result?.price,
        //   quantity: result?.origQty,
        //   status: result?.status,
        //   filled: result?.executedQty,
        //   remaining: result?.origQty - result?.executedQty,
        //   createdAt: new Date(),
        // };
      } else {
        throw new Error("Order placing failed");
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };
}
