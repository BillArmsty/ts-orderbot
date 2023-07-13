import {
  NewLinearOrder,
  RestClientV5,
  OrderParamsV5,
  OrderResultV5,
  GetAccountOrdersParamsV5,
  AccountOrderV5,
  CancelOrderParamsV5,
  GetTickersParamsV5,
  TickerLinearInverseV5,
} from "bybit-api";
import { Order } from "../types/exchange";
import { log } from "console";

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

  //Get Price
  getPrice = async (
    params: GetTickersParamsV5
  ): Promise<TickerLinearInverseV5[] | null> => {
    try {
      const { retCode, result, retMsg } = await this.client.getTickers(params);

      if (retCode == 0 && retMsg == "OK") {
        let _result = result.category;
        if (_result == "linear") {
          // return result.list.filter((item: any ) => item.symbol == params.symbol);
          return result.list.map((TickerLinearInverseV5: any) => {
            return {
              symbol: TickerLinearInverseV5.symbol,
              lastPrice: TickerLinearInverseV5.lastPrice,
              indexPrice: TickerLinearInverseV5.indexPrice,
              markPrice: TickerLinearInverseV5.markPrice,
              prevPrice24h: TickerLinearInverseV5.prevPrice24h,
              price24hPcnt: TickerLinearInverseV5.price24hPcnt,
              highPrice24h: TickerLinearInverseV5.highPrice24h,
              lowPrice24h: TickerLinearInverseV5.lowPrice24h,
              prevPrice1h: TickerLinearInverseV5.prevPrice1h,
              openInterest: TickerLinearInverseV5.openInterest,
              openInterestValue: TickerLinearInverseV5.openInterestValue,
              turnover24h: TickerLinearInverseV5.turnover24h,
              volume24h: TickerLinearInverseV5.volume24h,
              fundingRate: TickerLinearInverseV5.fundingRate,
              nextFundingTime: TickerLinearInverseV5.nextFundingTime,
              predictedDeliveryPrice:
                TickerLinearInverseV5.predictedDeliveryPrice,
              basisRate: TickerLinearInverseV5.basisRate,
              deliveryFeeRate: TickerLinearInverseV5.deliveryFeeRate,
              deliveryTime: TickerLinearInverseV5.deliveryTime,
              ask1Size: TickerLinearInverseV5.ask1Size,
              bid1Price: TickerLinearInverseV5.bid1Price,
              ask1Price: TickerLinearInverseV5.ask1Price,
              bid1Size: TickerLinearInverseV5.bid1Size,
            };
          });
        }
      }
    } catch (error) {
      console.log(`Error getting price: ${error}`);
      return null;
    }
    return [];
  };

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

  //Cancel Order
  cancelOrder = async (
    params: CancelOrderParamsV5
  ): Promise<OrderResultV5 | null> => {
    try {
      const { retCode, retMsg, result } = await this.client.cancelOrder(params);

      if (retCode == 0 && retMsg == "OK") {
        return {
          orderId: result.orderId,
          orderLinkId: result.orderLinkId,
        };
      }
    } catch (error) {
      console.log(`Error cancelling order: ${error}`);
    }

    return null;
  };
}
