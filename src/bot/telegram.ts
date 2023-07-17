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
            { text: "📈 Buy Order", callback_data: "buy" },
            { text: "📈 Sell Order", callback_data: "sell" },
          ],
          [
            { text: "📊 Active Orders", callback_data: "activeOrders" },
            { text: "📈 Get Price", callback_data: "price" },
          ],
          [
            { text: "📉 Cancel Order", callback_data: "cancel" },
            { text: "📉 Cancel All Orders", callback_data: "cancelAll" },
          ],
          [
            { text: "📊 Historical Orders", callback_data: "historicalOrders" },
            { text: "💰 Wallet Balance", callback_data: "balance" },
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
          { text: "📈 Buy Order", callback_data: "buy" },
          { text: "📈 Sell Order", callback_data: "sell" },
        ],
        [
          { text: "📊 Active Orders", callback_data: "activeOrders" },
          { text: "📈 Get Price", callback_data: "price" },
        ],
        [
          { text: "📉 Cancel Order", callback_data: "cancel" },
          { text: "📉 Cancel All Orders", callback_data: "cancelAll" },
        ],
        [
          { text: "📊 Historical Orders", callback_data: "historicalOrders" },
          { text: "💰 Wallet Balance", callback_data: "balance" },
        ],
      ],
    },
  });
});

//Get Price
bot.action("price", async (ctx) => {
  ctx.reply(`Enter Symbol and Category ie: BTCUSDT,linear`, {
    reply_markup: {
      force_reply: true,
    },
  });
  //Text to be entered has two values separated by a comma
  //ie: BTCUSDT, linear

  bot.on("text", async (ctx) => {
    const { text }: any = ctx.message;

    let [symbol, category]: any = normalizeMessage(text).split(",");

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

    ctx.reply(`Price of ${symbol} is ${price}`, {parse_mode: "Markdown"});
  });
});

//Place BuyOrder
bot.action("buy", async (ctx) => {
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
    const [side, symbol, qty, orderType, price]: any =
      normalizeMessage(text).split(",");
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );
    const orderPlaced = await bybit.placeOrder({
      category: "linear",
      side: side,
      symbol : symbol,
      qty : qty,
      orderType : orderType,
      price : price,

      timeInForce: "GTC",
      reduceOnly: false,
      closeOnTrigger: false,
    });
    console.log(orderPlaced);
    ctx.reply(`Buy order placed successfully ${orderPlaced?.orderId}`, {parse_mode: "Markdown"});
    // ctx.reply(`Buy order failed ${orderPlaced?.ret_msg}`)
  });
});

//Place SellOrder
bot.action("sell", async (ctx) => {
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
      side: side,
      symbol : symbol,
      qty : qty,
      orderType : orderType,
      price : price,
      timeInForce: "GTC",
      reduceOnly: false,
      closeOnTrigger: false,
    });
    console.log(orderPlaced);
    ctx.reply(`Sell order placed successfully ${orderPlaced?.orderId}`);
  });
});

//Cancel Order
bot.action("cancel", async (ctx) => {
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
bot.action("cancelAll", async (ctx) => {
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
bot.action("activeOrders", async (ctx) => {
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

//Get Historical Orders
bot.action("historicalOrders", async (ctx) => {
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
    const historicalOrders = await bybit.historicalOrders({
      symbol,
      category,
    });
    console.log(historicalOrders);
    ctx.reply(
      `Historical orders are ${historicalOrders?.map((h) => h.orderId)}`
    );
  });
});

//Get Balance
bot.action("balance", async (ctx) => {
  ctx.reply(`Enter  accountType and symbol ie: UNIFIED, BTCUSDT `, {
    reply_markup: {
      force_reply: true,
    },
  });
  bot.on("text", async (ctx) => {
    const { text } = ctx.message;
    const { accountType, coin }: any = text;
    const bybit = new Bybit(
      CONFIG.BYBIT_API_KEY,
      CONFIG.BYBIT_API_SECRET,
      CONFIG.BYBIT_TESTNET === "true"
    );
    const balance = await bybit.walletBalance({
      accountType,
      coin,
    });
    console.log(balance);
    ctx.reply(`Balance is ${balance?.map((b) => b.coin)}`);
  });
});

export { bot };
