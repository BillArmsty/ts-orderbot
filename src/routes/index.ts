import { Application } from "express";
// import { getPriceRouter } from "./api/getPrice";
import { placeOrderRouter } from "./api/placeOrder";

export const Routes = (app: Application) => {
    app.get('/ping', (req, res) => {
        res.send("Welcome To Bybit Trading Bot")

    });
    

    app.use(placeOrderRouter)


    // app.use(getPriceRouter)
};