import { LinearClient } from "bybit-api";

export class Bybit {
  client: LinearClient;

  constructor(API_KEY: string, API_SECRET: string, testnet: boolean) {
    this.client = new LinearClient({
      key: API_KEY,
      secret: API_SECRET,
      testnet,
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
}
