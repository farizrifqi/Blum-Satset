import BlumBot from "./src/Blum/BlumBot";
import fs from "node:fs";
import { checkVersion } from "./src/version";
import { getRandomInt, msToTime, sleep } from "./src/Blum/utils";
import prompts from "prompts";
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
  await blum.disconnect();
};
const start = async () => {
  console.clear();
  if (!process.argv.includes("--nocheckv")) await checkVersion();
  const loadedQuery = loadQuery();
  console.log(loadedQuery.length + " account(s) loaded");
  console.log(
    `RUNNING THIS WILL DISCONNECT WALLET ON ${loadedQuery.length} ACCOUNTS`
  );
  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    message: "SURE TO PROCEED?",
    initial: false,
  });
  if (!confirm) return;
  if (confirm == true) await Promise.all(loadedQuery.map((q) => runBot(q)));
  return;
};

start();
