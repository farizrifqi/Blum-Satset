import BlumBot from "./src/Blum/BlumBot";
import { log } from "./src/log";
import dotenv from "dotenv";
dotenv.config();
const init = async () => {
  if (!process.env.TG_QUERY) return;
  console.clear();
  const blum = new BlumBot(process.env.TG_QUERY);
  console.log(await blum.getUserInfo());
};

init();
