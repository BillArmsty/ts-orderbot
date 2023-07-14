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
  ): Promise<AccountOrderV5[] | null> => {
    try {
      const { retCode, retMsg, result } = await this.client.getActiveOrders(
        params
      );
      console.log("result", result);

      if (retCode == 0 && retMsg == "OK") {
        let _result = result.list;
        if (_result.length > 0) {
          return result.list.map((AccountOrderV5: any) => {
            return {
              orderId: AccountOrderV5.orderId,
              orderLinkId: AccountOrderV5.orderLinkId,
              blockTradeId: AccountOrderV5.blockTradeId,
              symbol: AccountOrderV5.symbol,
              price: AccountOrderV5.price,
              qty: AccountOrderV5.qty,
              side: AccountOrderV5.side,
              isLeverage: AccountOrderV5.isLeverage,
              positionIdx: AccountOrderV5.positionIdx,
              orderStatus: AccountOrderV5.orderStatus,
              cancelType: AccountOrderV5.cancelType,
              rejectReason: AccountOrderV5.rejectReason,
              avgPrice: AccountOrderV5.avgPrice,
              leavesQty: AccountOrderV5.leavesQty,
              leavesValue: AccountOrderV5.leavesValue,
              cumExecQty: AccountOrderV5.cumExecQty,
              cumExecValue: AccountOrderV5.cumExecValue,
              cumExecFee: AccountOrderV5.cumExecFee,
              timeInForce: AccountOrderV5.timeInForce,
              orderType: AccountOrderV5.orderType,
              stopOrderType: AccountOrderV5.stopOrderType,
              orderIv: AccountOrderV5.orderIv,
              triggerPrice: AccountOrderV5.triggerPrice,
              takeProfit: AccountOrderV5.takeProfit,
              stopLoss: AccountOrderV5.tpslMode,
              tpslMode: AccountOrderV5.tpslMode,
              tpLimitPrice: AccountOrderV5.tpLimitPrice,
              slLimitPrice: AccountOrderV5.slLimitPrice,
              tpTriggerBy: AccountOrderV5.tpTriggerBy,
              slTriggerBy: AccountOrderV5.slTriggerBy,
              triggerDirection: AccountOrderV5.triggerDirection,
              triggerBy: AccountOrderV5.triggerBy,
              lastPriceOnCreated: AccountOrderV5.lastPriceOnCreated,
              reduceOnly: AccountOrderV5.reduceOnly,
              closeOnTrigger: AccountOrderV5.closeOnTrigger,
              placeType: AccountOrderV5.placeType,
              smpType: AccountOrderV5.smpType,
              smpGroup: AccountOrderV5.smpGroup,
              smpOrderId: AccountOrderV5.smpOrderId,
              createdTime: AccountOrderV5.createdTime,
              updatedTime: AccountOrderV5.updatedTime,
            };
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
      console.log("result", result);
      

      if (retCode == 0 && retMsg == "OK") {
        let _result = result.list;
        if (_result.length > 0) {
          return result.list.map((AccountOrderV5: any) => {
            return {
              orderId: AccountOrderV5.orderId,
              orderLinkId: AccountOrderV5.orderLinkId,
              blockTradeId: AccountOrderV5.blockTradeId,
              symbol: AccountOrderV5.symbol,
              price: AccountOrderV5.price,
              qty: AccountOrderV5.qty,
              side: AccountOrderV5.side,
              isLeverage: AccountOrderV5.isLeverage,
              positionIdx: AccountOrderV5.positionIdx,
              orderStatus: AccountOrderV5.orderStatus,
              cancelType: AccountOrderV5.cancelType,
              rejectReason: AccountOrderV5.rejectReason,
              avgPrice: AccountOrderV5.avgPrice,
              leavesQty: AccountOrderV5.leavesQty,
              leavesValue: AccountOrderV5.leavesValue,
              cumExecQty: AccountOrderV5.cumExecQty,
              cumExecValue: AccountOrderV5.cumExecValue,
              cumExecFee: AccountOrderV5.cumExecFee,
              timeInForce: AccountOrderV5.timeInForce,
              orderType: AccountOrderV5.orderType,
              stopOrderType: AccountOrderV5.stopOrderType,
              orderIv: AccountOrderV5.orderIv,
              triggerPrice: AccountOrderV5.triggerPrice,
              takeProfit: AccountOrderV5.takeProfit,
              stopLoss: AccountOrderV5.tpslMode,
              tpslMode: AccountOrderV5.tpslMode,
              tpLimitPrice: AccountOrderV5.tpLimitPrice,
              slLimitPrice: AccountOrderV5.slLimitPrice,
              tpTriggerBy: AccountOrderV5.tpTriggerBy,
              slTriggerBy: AccountOrderV5.slTriggerBy,
              triggerDirection: AccountOrderV5.triggerDirection,
              triggerBy: AccountOrderV5.triggerBy,
              lastPriceOnCreated: AccountOrderV5.lastPriceOnCreated,
              reduceOnly: AccountOrderV5.reduceOnly,
              closeOnTrigger: AccountOrderV5.closeOnTrigger,
              placeType: AccountOrderV5.placeType,
              smpType: AccountOrderV5.smpType,
              smpGroup: AccountOrderV5.smpGroup,
              smpOrderId: AccountOrderV5.smpOrderId,
              createdTime: AccountOrderV5.createdTime,
              updatedTime: AccountOrderV5.updatedTime,
            };
          });
        }
      }
    } catch (error) {
      console.log(`Error getting historical orders: ${error}`);
      return null;
    }
    return [];
  };
}
