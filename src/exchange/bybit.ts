import {
  NewLinearOrder,
  RestClientV5,
  OrderParamsV5,
  OrderResultV5,
  GetAccountOrdersParamsV5,
  AccountOrderV5,
  GetAccountHistoricOrdersParamsV5,
} from "bybit-api";
import { Order } from "../types/exchange";

export class Bybit {
  client: RestClientV5;

  constructor(
    BYBIT_API_KEY: string,
    BYBIT_API_SECRET: string,
    testnet: boolean
  ) {
    this.client = new RestClientV5({
      key: BYBIT_API_KEY,
      secret: BYBIT_API_SECRET,
      testnet: true,
    });
  }

  //Make a order
  placeOrder = async (params: OrderParamsV5): Promise<OrderResultV5 | null> => {
    try {
      const { retCode, retMsg, result } = await this.client.submitOrder(params);

      if (retCode == 0 && retMsg == "OK") {
        return {
          orderId: result.orderId,
          orderLinkId: result.orderLinkId,
        };
      }

      if (retMsg?.includes("Qty not in range")) {
        console.log(`Qty not in range:, try again`);
      }
    } catch (error) {
      console.log(`Error placing order: ${error}`);
    }

    return null;
  };

  //Get Active Orders
  activeOrders = async (
    params: GetAccountOrdersParamsV5
  ): Promise<AccountOrderV5[]> => {
    try {
      const { retCode, retMsg, result } = await this.client.getActiveOrders(
        params
      );

      console.log(result);

      if (retCode == 0 && retMsg == "OK") {
        //Desctructure the result and return the orders
        let result: any = [];
        result.push(result.list[0]);
        if (result.length > 0) {
          let orders = result.map((order: any) => {
            return {
              id: order.orderId,
              symbol: order.symbol,
              side: order.side,
              type: order.orderType,
              price: order.price,
            };
          });
          return orders;
        }
      }
    } catch (error) {
      console.log(`Error getting active orders: ${error}`);
    }
    return [];
  };
}
