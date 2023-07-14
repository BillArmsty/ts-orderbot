import express from "express";
import { Routes } from "./routes";
import { Middleware } from "./middlewares";
import { bot } from "./bot/telegram";


const app = express();
Middleware(app);
Routes(app);
const Main = async () => {
  try {
    console.log("-------------".repeat(5));
    console.log("🤖🤖🤖 Starting Bybit Trading Bot 🤖🤖🤖");
    console.log("-------------".repeat(5));
    bot
      .launch()
      .then(() => {
         console.log("🤖🤖🤖 Bot Started 🤖🤖🤖");
      })
      .catch((err) => {
         console.log("🤖🤖🤖 Bot Failed to Start 🤖🤖🤖");
         console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

Main();

app.listen(8000, () => {
  console.log("🚀 🚀 🚀 🚀 Server running on port 8000🚀 🚀 🚀 🚀 ");
});
