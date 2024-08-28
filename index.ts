import BlumBot from "./src/Blum/BlumBot";
import { log } from "./src/log";
import dotenv from "dotenv";
dotenv.config();
const init = async () => {
  if (!process.env.TG_QUERY) return;
  const blum = new BlumBot(process.env.TG_QUERY);
  await blum.run();
};

init();
