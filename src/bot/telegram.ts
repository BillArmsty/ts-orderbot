import { Telegraf, Markup, Context } from "telegraf";
import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { normalizeMessage } from "./tgUtils";

const bot = new Telegraf(CONFIG.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    `Welcome to the Bybit Trading Bot
  Please Select an Option:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📈 Get Price", callback_data: "getPrice" },
            { text: "📊 Active Orders", callback_data: "activeOrders" },

            { text: "📉 Cancel Order", callback_data: "cancelOrder" },
            { text: "📉 Cancel All Orders", callback_data: "cancelAllOrders" },
            { text: "📈 Place Order", callback_data: "placeOrder" },
            { text: "📊 Historical Orders", callback_data: "historicalOrders" },
            { text: "💰 Wallet Balance", callback_data: "walletBalance" },
          ],
        ],
      },
    }
  );
});
//Create Bot Menu
bot.command("menu", async (ctx) => {
  ctx.reply(`Please Select an Option:`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📈 Get Price", callback_data: "getPrice" },
          { text: "📊 Active Orders", callback_data: "activeOrders" },
          { text: "📉 Cancel Order", callback_data: "cancelOrder" },
          { text: "📉 Cancel All Orders", callback_data: "cancelAllOrders" },
          { text: "📈 Place Order", callback_data: "placeOrder" },
          { text: "📊 Historical Orders", callback_data: "historicalOrders" },
          { text: "💰 Wallet Balance", callback_data: "walletBalance" },
        ],
      ],
    },
  });
});

//Get Price
bot.command("price", async (ctx) => {
  ctx.reply(`Enter Symbol and Category ie: BTCUSDT, linear`, {
    reply_markup: {
      force_reply: true,
    },
  });
  //Text to be entered has two values separated by a comma
    //ie: BTCUSDT, linear
 
    bot.on("text", async (ctx) => {
        
      const { text } = ctx.message
        const { symbol, category } : any = text;
        const bybit = new Bybit(
            CONFIG.BYBIT_API_KEY,
            CONFIG.BYBIT_API_SECRET,
            CONFIG.BYBIT_TESTNET === "true"
        );
        const price = await bybit.getPrice({
            symbol,
            category,
        });
        console.log(price);
        
        ctx.reply(`Price of ${symbol} is ${price?.map((p) => p.lastPrice)}`);
    });
});

export { bot };
