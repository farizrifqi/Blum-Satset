import BlumBot from "./src/Blum/BlumBot";
import fs from "node:fs";
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
  await Promise.all(loadQuery().map((q) => runBot(q)));
};

start();
