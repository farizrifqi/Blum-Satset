import BlumBot from "./src/Blum/BlumBot";
import fs from "node:fs";
import { checkVersion } from "./src/version";
import { getRandomInt, msToTime, sleep } from "./src/Blum/utils";
import prompts from "prompts";
import { log } from "./src/log";
const loadQuery = () => {
  return fs
    .readFileSync("query.txt", "utf8")
    .split("\n")
    .filter((q) => q !== "")
    .map((q) => q.replace(/\r|\s/g, ""));
};
const runBot = async (q: string, safe = false) => {
  const blum = new BlumBot(q);
  await sleep(getRandomInt(500, 3500));
  await blum.run(safe);
};
const helpShow = () => {
  console.log("Command:bun run index.ts [args]");
  console.log("Args:");
  console.log("--h", "\t\t", "Show help");
  console.log("--nocheckv", "\t", "Disable version check");
  console.log("--brute", "\t", "Brute mode wihtout prompt");
  console.log("--safe", "\t\t", "Safe mode wihtout prompt");
  console.log(
    "\n\n",
    'for pm2, recommended: pm2 start "bun run index.ts --nocheckv --brute" --name "Blum"'
  );
};
const start = async () => {
  console.clear();
  let safe: null | boolean | undefined = true;
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    return helpShow();
  }

  if (!process.argv.includes("--nocheckv")) await checkVersion();
  const loadedQuery = loadQuery();
  console.log(loadedQuery.length + " account(s) loaded");
  console.log("Help Command: bun run index.ts --help");
  if (!process.argv.includes("--safe") && !process.argv.includes("--brute")) {
    const response = await prompts({
      type: "select",
      name: "value",
      message: "Run?",
      choices: [
        {
          title: "Safe-run",
          value: "safe",
          description: "Bot will run one-by-one",
        },
        {
          title: "Brute-run",
          value: "brute",
          description: "Bot will run all account at same time",
        },
        { title: "Exit", value: null },
      ],
    });
    safe = response.value == "safe";
  }
  if (process.argv.includes("--brute")) {
    safe = false;
  }
  if (process.argv.includes("--safe")) {
    safe = true;
  }
  if (safe == undefined || safe == null) return;
  if (safe) {
    while (true) {
      let i = 0;
      for await (const q of loadedQuery) {
        i++;
        await runBot(q, safe);
        log("info", `Done`, `${i} / ${loadedQuery.length}`);
      }
      let normalTime = 60 * 1000 * 60 * 4;
      let costTime = 60 * 1000 * 3 * loadedQuery.length;
      let sleepTime = normalTime - costTime;
      if (sleepTime < 0) sleepTime = sleepTime * -1;
      console.log(`Sleeping in`, msToTime(sleepTime));
      await sleep(sleepTime);
    }
  } else {
    await Promise.all(loadedQuery.map((q) => runBot(q, safe)));
  }
};

start();
