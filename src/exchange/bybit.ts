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
  CancelAllOrdersParamsV5,
  GetWalletBalanceParamsV5,
  WalletBalanceV5,
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
          return result.list.map((TickerLinearInverseV5: any) => {
            let _price = TickerLinearInverseV5.lastPrice;
            return _price;
          });
        }
      }
    } catch (error) {
      console.log(`Error getting price: ${error}`);
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
  ): Promise<AccountOrderV5[] | null> => {
    try {
      const { retCode, retMsg, result } = await this.client.getActiveOrders(
        params
      );
      console.log("result", result, "retCode", retCode, "retMsg", retMsg);

      if (retCode == 0 && retMsg == "OK") {
        let _result = result.category;
        if (_result == "linear") {
          return result.list.map((AccountOrderV5: any) => {
            let _order = AccountOrderV5.orderId;
            return _order;
          });
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

  //Cancel All Orders
  cancelAllOrders = async (
    params: CancelAllOrdersParamsV5
  ): Promise<OrderResultV5[] | null> => {
    try {
      const { retCode, retMsg, result } = await this.client.cancelAllOrders(
        params
      );

      if (retCode == 0 && retMsg == "OK") {
        let _result = result.list;
        if (_result.length > 0) {
          return result.list.map((OrderResultV5: any) => {
            return {
              orderId: OrderResultV5.orderId,
              orderLinkId: OrderResultV5.orderLinkId,
            };
          });
        }
      }
    } catch (error) {
      console.log(`Error cancelling all orders: ${error}`);
    }
    return [];
  };

  //Get Historical Orders
  historicalOrders = async (
    params: GetAccountOrdersParamsV5
  ): Promise<AccountOrderV5[] | null> => {
    try {
      const { retCode, retMsg, result } = await this.client.getHistoricOrders(
        params
      );
      console.log("result", result, "retCode", retCode, "retMsg", retMsg);

      if (retCode == 0 && retMsg == "OK") {
        let _result = result.category;
        if (_result == "linear") {
          return result.list.map((AccountOrderV5: any) => {
            let _order = AccountOrderV5.orderId;
            return _order;
          });
        }
      }
    } catch (error) {
      console.log(`Error getting historical orders: ${error}`);
      return null;
    }
    return [];
  };

  //Get Wallet Balance
  walletBalance = async (
    params: GetWalletBalanceParamsV5
  ): Promise<WalletBalanceV5[] | null> => {
    try {
      const { retCode, retMsg, result } = await this.client.getWalletBalance(
        params
      );
      console.log("result", result, retCode, retMsg);

      if (retCode == 0 && retMsg == "OK") {
        return result.list.map((WalletBalanceV5: any) => {
          let balance = WalletBalanceV5.totalWalletBalance;
          return balance;
        });
      }
    } catch (error) {
      console.log(`Error getting wallet balance: ${error}`);
    }
    return [];
  };
}
