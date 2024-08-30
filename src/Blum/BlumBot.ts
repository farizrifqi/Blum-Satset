import axios, { RawAxiosRequestHeaders } from "axios";
import { BLUM_GAME_DOMAIN, BLUM_GATEWAY, TRIBE } from "../const";
import { log } from "../log";
import { getRandomInt, sleep } from "./utils";

export default class BlumBot {
  private token: string | undefined = undefined;
  private query: string;
  public username: string;
  constructor(query: string) {
    this.query = query;
  }

  private _getHeaders = (): RawAxiosRequestHeaders => {
    return {
      Authorization: "Bearer " + this.token,
      Accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-length": "0",
      origin: "https://telegram.blum.codes",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24", "Microsoft Edge WebView2";v="125"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
    };
  };
  private _getTask = async () => {
    let response: any = undefined;
    try {
      const request = await axios.get(BLUM_GAME_DOMAIN + "/api/v1/tasks", {
        headers: this._getHeaders(),
      });
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._getTask();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to get task");
      }
      return undefined;
    }
  };
  private _getBalance = async () => {
    let response: any = undefined;
    try {
      const request = await axios.get(
        BLUM_GAME_DOMAIN + "/api/v1/user/balance",
        {
          headers: this._getHeaders(),
        }
      );

      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.log(error.response.data.message);
      }
      return undefined;
    }
  };
  private _claimFarming = async () => {
    log("info", `[${this.username}]`, "Claim farming");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/farming/claim",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      log("success", `[${this.username}]`, "Farming claimed");
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._claimFarming();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to claim farming");
      }
      return undefined;
    }
  };
  private _startFarming = async () => {
    log("info", `[${this.username}]`, "Start farming");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/farming/start",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._startFarming();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to start farming");
      }
      return undefined;
    }
  };
  private _dailyReward = async () => {
    log("info", `[${this.username}]`, "Checking daily reward");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/daily-reward?offset=-420",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._dailyReward();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to start farming");
      }
      return undefined;
    }
  };
  private _startTask = async ({ id, title }: any) => {
    log("info", `[${this.username}]`, "Start task", title);
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/tasks/" + id + "/start",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._startTask({ id, title });
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to start task", title);
      }
      return undefined;
    }
  };
  private _startGame = async () => {
    log("info", `[${this.username}]`, "Start game");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/game/play",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._startGame();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to play game");
      }
      return undefined;
    }
  };
  private _claimGame = async (gameId: any) => {
    let points = getRandomInt(256, 278);

    log("info", `[${this.username}]`, "Claiming game", gameId);
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/game/claim",
        { gameId, points: getRandomInt(256, 278) },
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      log("success", `[${this.username}]`, "Game rewarded", points);
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._claimGame(gameId);
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to play game");
      }
      return undefined;
    }
  };
  private _claimTask = async ({ id, title }: any) => {
    log("info", `[${this.username}]`, "[Claim Task]", title);
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/tasks/" + id + "/claim",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._claimTask({ id, title });
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to claim task", title);
      }
      return undefined;
    }
  };
  private _refreshToken = async (tries: number = 1) => {
    if (tries > 3) {
      log("danger", `[${this.username}]`, "Failed to refresh token");
      process.exit(0);
    }
    if (this.username) {
      log(`[${this.username}]`, "Attempt to refresh token", `${tries}/3`);
    }
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GATEWAY + "/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP",
        { query: this.query },
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://telegram.blum.codes",
            priority: "u=1, i",
            referer: "https://telegram.blum.codes/",
          },
        }
      );
      response = request.data;
      if (!response?.token?.refresh) throw new Error("Failed to refresh token");
      this.token = response?.token?.refresh;
      if (this.username) {
        log("success", `[${this.username}]`, "Token refreshed");
      }

      return;
    } catch (error: any) {
      log(
        "danger",
        `[${this.username}]`,
        "Failed refresh token - engine error"
      );
    }
    return this._refreshToken(tries + 1);
  };
  private _getUserInfo = async () => {
    let response: any = undefined;
    try {
      const request = await axios.get(BLUM_GATEWAY + "/v1/user/me", {
        headers: this._getHeaders(),
      });
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return this._getUserInfo();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to get user info");
      }
      return undefined;
    }
  };
  private _errorHandler = async (errorData: any, isRefresh = false) => {
    if (isRefresh) {
      await this._refreshToken();
    } else {
      log("warning", `[${this.username}]`, errorData ?? "");
    }
    return;
  };
  private _init = async (i = 0) => {
    if (i >= 5) return;
    try {
      if (!this.token) await this._refreshToken();
      const userInfo = await this._getUserInfo();
      if (!userInfo?.username) return false;
      this.username = userInfo.username;
      return true;
    } catch (err) {
      i++;
      await sleep(5000);
      return await this._init(i);
    }
  };
  private _isTokenValid = (msg: string) => {
    if (msg.toLowerCase().includes("token is invalid")) return true;
    if (msg.toLowerCase().includes("invalid jwt token")) return true;
    return false;
  };
  getUserInfo = async () => {
    return await this._getUserInfo();
  };
  getTask = async (print: Boolean = false) => {
    const tasks = await this._getTask();
    if (!tasks) return [];

    const subtasks = tasks.flatMap((task: any) => task.tasks);
    if (!print) return subtasks;
    console.table(
      subtasks.map((task: any) => ({
        // id: task.id,
        title: task.title,
        // kind: task.kind,
        status: task.status,
        type: task.type,
      }))
    );
    return subtasks;
  };
  getBalance = async (print = true) => {
    const balance = await this._getBalance();
    console.log({ balance });
    if (balance) {
      if (print) {
        log("info", `[${this.username}]`, "Balance", balance.availableBalance);
      }
    }
  };
  run = async () => {
    await this._init();
    Promise.all([
      this.runFarming(),
      this.runGame(),
      this.runTask(),
      this.runDailyReward(),
    ]);
  };
  runDailyReward = async () => {
    const dailyReward = await this._dailyReward();
    if (dailyReward?.message === "OK") {
      log("success", `[${this.username}]`, "Claimed daily reward");
    } else if (dailyReward?.message === "same day") {
      log(`[${this.username}]`, "Already claimed today");
    } else {
      log("warning", `[${this.username}]`, "Daily reward not ready");
    }
    await sleep(1000 * 60 * 60 * 24 + 10000);
    return await this.runDailyReward();
  };
  runGame = async (i = 0) => {
    if (i > 0) {
      const gameResult = await this._startGame();
      await sleep(20 * 1000);
      if (gameResult?.gameId) {
        log(
          "success",
          `[${this.username}]`,
          "Game completed",
          gameResult.gameId
        );
        await this._claimGame(gameResult.gameId);
      }
      if (i - 1 > 0) return await this.runGame(i - 1);
    } else {
      const balance = await this._getBalance();
      if (balance) {
        if (balance.playPasses > 0) return this.runGame(balance.playPasses);
        log(`[${this.username}]`, "No game passes");
      } else {
        log("info", `[${this.username}]`, "Failed to get balance");
        await sleep(60 * 1000 * 60 * 1);
      }
    }
    await sleep(60 * 1000 * 60 * 6);
    return await this.runGame();
  };
  runFarming = async () => {
    const balance = await this._getBalance();
    if (balance) {
      if (!balance.farming?.startTime) {
        await sleep(1000 * 60);
        await this._claimFarming();
        await sleep(1000 * 30);
        await this._startFarming();
      } else {
        if (balance.farming?.endTime <= balance.timestamp) {
          await sleep(1000 * 60);

          await this._claimFarming();
          await sleep(1000 * 30);
          await this._startFarming();
        } else {
          log(`[${this.username}]`, "Still farming");
          log(
            "success",
            `[${this.username}]`,
            "Balance",
            balance.availableBalance
          );
          if (balance.farming.endTime - balance.timestamp > 1000 * 60 * 30) {
            await sleep(1000 * 60 * 60);
          } else {
            await sleep(balance.farming.endTime - balance.timestamp + 5000);
          }
        }
      }
    } else {
      log("info", `[${this.username}]`, "Failed to get balance");
      await sleep(60 * 1000 * 60 * 1);
    }
    return await this.runFarming();
  };
  runTask = async (print: Boolean = false) => {
    let tasks = await this.getTask(print);
    if (tasks) {
      if (
        tasks.filter(
          (task: any) =>
            task.status == "NOT_STARTED" && task.type != "PROGRESS_TARGET"
        ).length > 0
      ) {
        await Promise.all(
          tasks
            .filter(
              (task: any) =>
                task.status == "NOT_STARTED" && task.type != "PROGRESS_TARGET"
            )
            .map((task: any) =>
              this._startTask({ id: task.id, title: task.title }).then((a) => {
                if (a) {
                  sleep(10000).then(() => {
                    this._claimTask({ id: task.id, title: task.title });
                  });
                }
              })
            )
        );

        // Re check task
        tasks = await this.getTask(print);
        if (
          tasks.filter((task: any) => task.status == "READY_FOR_CLAIM").length >
          0
        ) {
          log("info", `[${this.username}]`, "Claiming un-checked tasks...");
          await Promise.all(
            tasks
              .filter((task: any) => task.status == "READY_FOR_CLAIM")
              .map((task: any) =>
                this._claimTask({ id: task.id, title: task.title })
              )
          );
        }
      } else {
        log(`[${this.username}]`, "No tasks to run");
      }
    } else {
      log("danger", `[${this.username}]`, "Failed to run task");
    }
    await sleep(60 * 1000 * 60 * 3);
    return await this.runTask();
  };

  getTribe = () => {
    return TRIBE;
  };
}