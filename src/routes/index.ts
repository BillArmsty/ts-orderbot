import { Application } from "express";
import { getPriceRouter } from "./api/getPrice";
import { placeOrderRouter } from "./api/placeOrder";
import { activeOrdersRouter } from "./api/activeOrders";
import { cancelOrderRouter } from "./api/cancelOrder";
import { cancelAllOrdersRouter } from "./api/cancelAllOrders";
import { historicalOrdersRouter } from "./api/historicalOrders";
import { walletBalanceRouter } from "./api/walletBalance";

export const Routes = (app: Application) => {
  app.get("/ping", (req, res) => {
    res.send("Welcome To Bybit Trading Bot");
  });

  app.use(placeOrderRouter);
  app.use(activeOrdersRouter);
  app.use(cancelOrderRouter);
  app.use(getPriceRouter);
  app.use(cancelAllOrdersRouter);
  app.use(historicalOrdersRouter);
  app.use(walletBalanceRouter);

};
