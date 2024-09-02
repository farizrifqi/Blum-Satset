import BlumBot from "./src/Blum/BlumBot";
import fs from "node:fs";
import { checkVersion } from "./src/version";
import { getRandomInt, sleep } from "./src/Blum/utils";
const loadQuery = () => {
  return fs
    .readFileSync("query.txt", "utf8")
    .split("\n")
    .filter((q) => q !== "")
    .map((q) => q.replace(/\r|\s/g, ""));
};
const runBot = async (q: string) => {
  const blum = new BlumBot(q);
  await sleep(getRandomInt(500, 3500));
  await blum.run();
};
const start = async () => {
  console.clear();
  if (!process.argv.includes("--nocheckv")) await checkVersion();
  const loadedQuery = loadQuery();
  console.log(loadedQuery.length + " account(s) loaded");
  await Promise.all(loadedQuery.map((q) => runBot(q)));
};

start();
