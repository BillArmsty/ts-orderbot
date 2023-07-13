import express from "express";
import { Routes } from "./routes";
import { Middleware } from "./middlewares";
// import { Middleware } from './middleware';

const Main = () => {
  const app = express();

  Middleware(app);
  Routes(app);
  app.listen(8000, () => {
    console.log("🚀 🚀 🚀 🚀 Server running on port 8000🚀 🚀 🚀 🚀 ");
  });
};
Main();
