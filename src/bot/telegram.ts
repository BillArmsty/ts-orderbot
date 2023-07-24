import { Telegraf, Markup, Context } from "telegraf";
import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";
import { normalizeMessage } from "./tgUtils";
import { Binance } from "../exchange/binance";

const bot = new Telegraf(CONFIG.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    `Welcome to the ULTIMATE Trading Bot
    Please Select A Platform:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📊 BYBIT 📊", callback_data: "bybit" },
            { text: "📊 BINANCE 📊", callback_data: "binance" },
          ],
        ],
      },
    }
  );
});

bot.start((ctx) => {});

bot.action("bybit", async (ctx) => {
  try {
    ctx.reply(
      `Bybit Trading Bot Menu
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
              {
                text: "📊 Historical Orders",
                callback_data: "historicalOrders",
              },
              { text: "💰 Wallet Balance", callback_data: "balance" },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.log(`Error displaying bybit menu: ${error}`);
  }
});

//Create Bot Menu
bot.action("binance", async (ctx) => {
  try {
    ctx.reply(`Please Enter A Symbol To Get Price ie ETHUSDT : `, {
      reply_markup: {
        force_reply: true,
      },
    });

    bot.on("text", async (ctx) => {
      const { text }: any = ctx.message;
      const symbol = normalizeMessage(text);

      const binance = new Binance(
        CONFIG.BINANCE_API_KEY,
        CONFIG.BINANCE_API_SECRET,
        true
      );

      const latestPrice = await binance.getPrice({
        symbol,
      });

      // Check if latestPrice is an array
      if (Array.isArray(latestPrice)) {
        if (latestPrice.length === 0) {
          ctx.reply(`No price data available for ${symbol}.`);
          return;
        }

        // If it's an array, get the price from the first element
        const price = latestPrice[0].price;
        ctx.reply(`The Latest Price For ${symbol} is ${price}`);
      } else {
        // If it's a single object, directly get the price
        const price = latestPrice.price;
        ctx.reply(`The Latest Price For ${symbol} is ${price}`);
      }
    });
  } catch (error) {
    console.log(`Error getting price: ${error}`);
  }
});

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

    ctx.reply(`Price of ${symbol} is ${price}`, { parse_mode: "Markdown" });
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
      symbol: symbol,
      qty: qty,
      orderType: orderType,
      price: price,

      timeInForce: "GTC",
      reduceOnly: false,
      closeOnTrigger: false,
    });
    console.log(orderPlaced);
    ctx.reply(`Buy order placed successfully ${orderPlaced?.orderId}`, {
      parse_mode: "Markdown",
    });
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
      symbol: symbol,
      qty: qty,
      orderType: orderType,
      price: price,
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
