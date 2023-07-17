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
            { text: "📈 Buy Order", callback_data: "placeBuyOrder" },
            { text: "📈 Sell Order", callback_data: "placeSellOrder" },
          ],
          [
            { text: "📊 Active Orders", callback_data: "activeOrders" },
            { text: "📈 Get Price", callback_data: "getPrice" },
          ],
          [
            { text: "📉 Cancel Order", callback_data: "cancelOrder" },
            { text: "📉 Cancel All Orders", callback_data: "cancelAllOrders" },
          ],
          [
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
          { text: "📈 Buy Order", callback_data: "placeBuyOrder" },
          { text: "📈 Sell Order", callback_data: "placeSellOrder" },
        ],
        [
          { text: "📊 Active Orders", callback_data: "activeOrders" },
          { text: "📈 Get Price", callback_data: "getPrice" },
        ],
        [
          { text: "📉 Cancel Order", callback_data: "cancelOrder" },
          { text: "📉 Cancel All Orders", callback_data: "cancelAllOrders" },
        ],
        [
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
    const { text } = ctx.message;
    const { symbol, category }: any = text;
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

//Place BuyOrder
bot.command("buy", async (ctx) => {
  ctx.reply(
    `Enter side, symbol, qty, orderType, price ie: Buy, BTCUSDT, 1, Limit, 50000`,
    {
      reply_markup: {
        force_reply: true,
      },
    }
  );
  bot.on("text", async (ctx) => {
    const { text } = ctx.message;
    const { side, symbol, qty, orderType, price }: any = text;
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );
    const orderPlaced = await bybit.placeOrder({
      category: "linear",
      side,
      symbol,
      qty,
      orderType,
      price,

      timeInForce: "GTC",
      reduceOnly: false,
      closeOnTrigger: false,
    });
    console.log(orderPlaced);
    ctx.reply(`Buy order placed successfully ${orderPlaced?.orderId}`);
  });
});

//Place SellOrder
bot.command("sell", async (ctx) => {
  ctx.reply(
    `Enter side, symbol, qty, orderType, price ie: Sell, BTCUSDT, 1, Limit, 50000`,
    {
      reply_markup: {
        force_reply: true,
      },
    }
  );
  bot.on("text", async (ctx) => {
    const { text } = ctx.message;
    const { side, symbol, qty, orderType, price }: any = text;
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );
    const orderPlaced = await bybit.placeOrder({
      category: "linear",
      side,
      symbol,
      qty,
      orderType,
      price,
      timeInForce: "GTC",
      reduceOnly: false,
      closeOnTrigger: false,
    });
    console.log(orderPlaced);
    ctx.reply(`Sell order placed successfully ${orderPlaced?.orderId}`);
  });
});

//Cancel Order
bot.command("cancel", async (ctx) => {
  ctx.reply(`Enter symbol,  category , orderId ie: BTCUSDT, linear, 123456`, {
    reply_markup: {
      force_reply: true,
    },
  });
  bot.on("text", async (ctx) => {
    const { text } = ctx.message;
    const { symbol, orderId, category }: any = text;
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );
    const orderCancelled = await bybit.cancelOrder({
      symbol,
      orderId,
      category,
    });
    console.log(orderCancelled);
    ctx.reply(`Order cancelled successfully ${orderCancelled?.orderId}`);
  });
});

//Cancel All Orders
bot.command("cancelAll", async (ctx) => {
  ctx.reply(`Enter symbol,  category ie: BTCUSDT, linear`, {
    reply_markup: {
      force_reply: true,
    },
  });
  bot.on("text", async (ctx) => {
    const { text } = ctx.message;
    const { symbol, category }: any = text;
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );
    const orderCancelled = await bybit.cancelAllOrders({
      symbol,
      category,
    });
    console.log(orderCancelled);
    ctx.reply(`All orders cancelled successfully`);
  });
});

//Get Active Orders
bot.command("activeOrders", async (ctx) => {
  ctx.reply(`Enter symbol,  category ie: BTCUSDT, linear`, {
    reply_markup: {
      force_reply: true,
    },
  });
  bot.on("text", async (ctx) => {
    const { text } = ctx.message;
    const { symbol, category }: any = text;
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );
    const activeOrders = await bybit.activeOrders({
      symbol,
      category,
    });
    console.log(activeOrders);
    ctx.reply(`Active orders are ${activeOrders?.map((a) => a.orderId)}`);
  });
});
export { bot };
