import axios from "axios";
import fs from "node:fs";
import { sleep } from "./Blum/utils";

export const checkVersion = async () => {
  try {
    const thisVersion = fs.readFileSync("version", "utf8");
    const lastVersion = await getLastestVersion();
    if (thisVersion < lastVersion) throw new Error("Need update");
    return true;
  } catch (err) {
    console.log("--- WARNING ---");
    console.log("Version outdated. Please run: git pull");
    console.log('OR. Run with  "--nocheckv"');
    console.log("Visit: https://github.com/farizrifqi/Blum-Satset");
    await sleep(40000);
    process.exit();
  }
};

const getLastestVersion = async () => {
  try {
    const request = await axios.get(
      "https://raw.githubusercontent.com/farizrifqi/Blum-Satset/main/version"
    );
    return request?.data;
  } catch (err) {
    return false;
  }
};
