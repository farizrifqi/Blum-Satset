import { currentTime } from "./Blum/utils";
var colors = require("@colors/colors/safe");
enum COLOUR {
  Danger = "danger",
  Warning = "warning",
  Info = "info",
  Success = "success",
}
export const log = (...outputs: any[]) => {
  let listObj: any = {};
  let getObj = outputs.filter((o: any) => typeof o == "object");
  getObj.forEach((ob: any) => {
    Object.keys(ob).forEach((o) => {
      listObj[o] = ob[o];
    });
  });
  let type = outputs[0];
  if (Object.values(COLOUR).includes(type)) {
    outputs.shift();
    let realOutputs = outputs;
    switch (type) {
      case "danger":
        realOutputs = realOutputs.map((o) => colors.red(o));
        break;
      case "warning":
        realOutputs = realOutputs.map((o) => colors.yellow(o));
        break;
      case "info":
        realOutputs = realOutputs.map((o) => colors.cyan(o));
        break;
      case "success":
        realOutputs = realOutputs.map((o) => colors.green(o));
        break;
    }
    console.log(colors.inverse(`[${currentTime()}]`), ...realOutputs);
  } else {
    console.log(colors.inverse(`[${currentTime()}]`), ...outputs);
  }
};
