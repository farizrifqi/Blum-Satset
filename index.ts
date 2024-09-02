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
const runBot = async (blum: BlumBot) => {
  await blum.run();
};
const initBot = async (q: string) => {
  const blum = new BlumBot(q);
  await blum._init();
  await sleep(getRandomInt(500, 2500));
  return blum;
};
const start = async () => {
  console.clear();
  if (!process.argv.includes("--nocheckv")) await checkVersion();
  const loadedQuery = loadQuery();
  console.log(loadedQuery.length + " account(s) loaded");
  let a: BlumBot[] = [];
  let i = 1;
  console.log("Initiating...");
  for await (const q of loadedQuery) {
    a.push(await initBot(q));
    console.log("Initiated", `${i}/${loadedQuery.length}`);
    i++;
  }
  console.clear();
  console.log("All Initiated");
  await Promise.all(a.map((q) => runBot(q)));
};

start();
