import { Telegraf, Markup } from "telegraf";
import { CONFIG } from "../config/config";
import { Bybit } from "../exchange/bybit";

const  bot = new Telegraf(CONFIG.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(`Welcome to Bybit Trading Bot, ${ctx.message.from.first_name}!`);
  // Markup.keyboard([
  //     ["📈 Get Price", "📊 Active Orders"],
  //     ["📉 Cancel Order", "📉 Cancel All Orders"],
  //     ["📈 Place Order", "📊 Historical Orders"],
  // ])
});

const getOptions = () => {
    return {
        key: CONFIG.BYBIT_API_KEY,
        secret: CONFIG.BYBIT_API_SECRET,
        testnet: CONFIG.BYBIT_TESTNET === "true",
    }
}

export { bot }
