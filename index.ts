import BlumBot from "./src/Blum/BlumBot";
import fs from "node:fs";
import { checkVersion } from "./src/version";
import { sleep } from "./src/Blum/utils";
const loadQuery = () => {
  return fs
    .readFileSync("query.txt", "utf8")
    .split("\n")
    .filter((q) => q !== "");
};
const runBot = async (q: string) => {
  const blum = new BlumBot(q);
  await blum.run();
};
const start = async () => {
  console.clear();
  if (!process.argv.includes("--nocheckv")) await checkVersion();
  const loadedQuery = loadQuery();
  console.log(loadedQuery.length + " account(s) loaded");
  for await (const q of loadedQuery) {
    await sleep(15000);
    await runBot(q);
  }
};

start();
