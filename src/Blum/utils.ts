import fs from "node:fs";

const zeroPad = (str: string, s = false) => {
  str = str.toString();
  if (s) {
    str = str.length > 2 ? str.substring(0, 2) : str;
  }
  return str.length >= 2 ? str : "0" + str;
};

export const currentTime = () => {
  let date_ob = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  let hours = zeroPad(date_ob.getHours().toString());
  let minutes = zeroPad(date_ob.getMinutes().toString());
  let seconds = zeroPad(date_ob.getSeconds().toString());
  let milsec = zeroPad(date_ob.getMilliseconds().toString(), true);
  return hours + ":" + minutes + ":" + seconds + ":" + milsec;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

export const loadReferral = () => {
  return fs.readFileSync("referral.txt", "utf8");
};

export const msToTime = (duration: number) => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m`;
};
