import {
  LinearClient,
  LinearOrder,
  LinearPositionIdx,
  NewLinearOrder,
} from "bybit-api";
import { Order } from "../types/exchange";

export class Bybit {
  client: LinearClient;

  constructor(
    BYBIT_API_KEY: string,
    BYBIT_API_SECRET: string,
    testnet: boolean
  ) {
    this.client = new LinearClient({
      key: BYBIT_API_KEY,
      secret: BYBIT_API_SECRET,
      testnet:true,
    });
  }

  // Get the latest price for a symbol
  getPrice = async (symbol: string): Promise<number | null> => {
    try {
      const { ret_code, result, ret_msg } = await this.client.getTickers({
        symbol,
      });
      let _result = result.find(
        (item: { symbol: string }) => item.symbol === symbol
      );
      if (ret_code === 0) {
        return _result.last_price;
      }
      console.log(result);
      if (ret_code === 0 && _result[0]) {
        return _result[0]?.symbol.last_price;
      } else {
        throw new Error(ret_msg);
      }
    } catch (error) {}
    return null;
  };

  //Make a order
  placeOrder = async (params: NewLinearOrder): Promise<Order | null> => {
    const { ret_code, ret_msg, result } = await this.client.placeActiveOrder(
      params
    );
console.log("result",result,"ret_code",ret_code,"ret_msg",ret_msg);

    if (ret_code == 0 && result) {
      return {
        id: result.order_id,
        market: result.symbol,
        side: result.side,
        type: result.order_type,
        price: result.price,
        quantity: result.qty,
        status: result.order_status,
        filled: result.cum_exec_qty,
        remaining: result.qty - result.cum_exec_qty,
        createdAt: new Date(result.created_time),
      };
    }

    if (ret_msg?.includes("Qty not in range")) {
      console.log(`Qty not in range:, try again`);
    }
    console.log(`Error placing order: ${ret_msg}`);
    

    return null;
  };
}
