import {
  NewLinearOrder,
  RestClientV5,
  OrderParamsV5,
  OrderResultV5,
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
      testnet:true,
    });
  }

  //Make a order
  placeOrder = async (params: OrderParamsV5): Promise< OrderResultV5| null> => {
    try {
    const { retCode, retMsg, result } = await this.client.submitOrder(
      params
    );
console.log("result",result,"retCode",retCode,"retMsg",retMsg);

    if (retCode == 0 && retMsg == "OK") {
      return {
        orderId: result.orderId,
        orderLinkId: result.orderLinkId,

      };
    }

    if (retMsg?.includes("Qty not in range")) {
      console.log(`Qty not in range:, try again`);
    }
   // console.log(`Error placing order: ${retMsg}`);
    
  } catch (error) {
    console.log(`Error placing order: ${error}`);
  }
    

    return null;
  };
}
