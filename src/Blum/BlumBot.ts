import axios, { RawAxiosRequestHeaders } from "axios";
import {
  BLUM_EARN_DOMAIN,
  BLUM_GAME_DOMAIN,
  BLUM_GATEWAY,
  BLUM_USER_DOMAIN,
  BLUM_WALLET_DOMAIN,
  TRIBE,
} from "../const";
import { log } from "../log";
import { getRandomInt, loadReferral, sleep } from "./utils";
const reff = loadReferral();
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
      const request = await axios.get(BLUM_EARN_DOMAIN + "/api/v1/tasks", {
        headers: this._getHeaders(),
      });
      response = request.data;
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return await this._getTask();
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
        log("danger", `[${this.username}]`, "Failed getBalance");
      }
      return false;
    }
  };
  private _getPoints = async () => {
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
        log("danger", `[${this.username}]`, "Failed getPoints");
      }
      return false;
    }
  };
  private _claimFarming = async (points = -1) => {
    // log(
    //   "danger",
    //   `[${this.username}]`,
    //   "Claim farming currently disabled because an update. PM developer."
    // );
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
      log(
        "success",
        `[${this.username}]`,
        "Farming claimed",
        points < 0 ? 0 : points
      );
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (
          error?.response?.data?.message?.toLowerCase() ==
          "it's too early to claim"
        ) {
          await sleep(1000 * 15000);
          return await this._claimFarming(points);
        }
        if (
          error?.response?.data?.message?.toLowerCase() == "need to start farm"
        ) {
          return await this._startFarming();
        }
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return await this._claimFarming(points);
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
          return await this._startFarming();
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
        BLUM_GAME_DOMAIN + "/api/v1/daily-reward?offset=-480",
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
          return await this._dailyReward();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
        return error?.response?.data;
      } else {
        log("danger", `[${this.username}]`, "Failed to dailyReward");
      }
      return undefined;
    }
  };
  private _startTask = async ({ id, title }: any) => {
    log("info", `[${this.username}]`, "Start task", title);
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_EARN_DOMAIN + "/api/v1/tasks/" + id + "/start",
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
          return await this._startTask({ id, title });
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
  private _startGame = async (i = 0) => {
    i++;
    await sleep(getRandomInt(500, 8500));
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
          return await this._startGame(i);
        }
        if (error?.response?.data?.message) {
          if (error?.response?.data?.message == "cannot start game") {
            await sleep(getRandomInt(500, 3000));
            if (i > 5) return await this._startGame(i);
          }
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
        { gameId, points: Math.floor(Math.random() * (270 - 160 + 1)) + 160 },
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      log("success", `[${this.username}]`, "Game rewarded", points);
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (
          error?.response?.data?.message.toLowerCase() ==
          "game session not finished"
        ) {
          await sleep(30000);
          return await this._claimGame(gameId);
        }
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return await this._claimGame(gameId);
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
    log("info", `[${this.username}]`, "[TASK]", title, "CLAIMING");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_EARN_DOMAIN + "/api/v1/tasks/" + id + "/claim",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      log("success", `[${this.username}]`, "[TASK]", title, "Claimed");

      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return await this._claimTask({ id, title });
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
  private _earnTask = async ({ id, title }: any) => {
    log("info", `[${this.username}]`, "[TASK]", title, "CLAIMING");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_EARN_DOMAIN + "/api/v1/tasks/" + id + "/start",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      log("success", `[${this.username}]`, "[TASK]", title, "Claimed");

      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return await this._earnTask({ id, title });
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
  private _verifyTask = async ({ id, title, keyword }: any) => {
    log("info", `[${this.username}]`, "[TASK]", title, "VERIFYING");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_GAME_DOMAIN + "/api/v1/tasks/" + id + "/validate",
        { keyword },
        {
          headers: this._getHeaders(),
        }
      );
      response = request.data;
      if (response.title) {
        log("success", `[${this.username}]`, "[TASK]", title, "Verified");
      } else {
        log("danger", `[${this.username}]`, "[TASK]", title, "Verify failed.");
      }

      return response;
    } catch (error: any) {
      if (error.response?.data) {
        if (this._isTokenValid(error?.response?.data?.message)) {
          await this._errorHandler("", true);
          return await this._claimTask({ id, title });
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to verify task", title);
      }
      return undefined;
    }
  };
  private _refreshToken = async (tries: number = 1) => {
    await sleep(getRandomInt(500, 2000));
    if (tries > 5) {
      log("danger", "Failed to refresh token");
      return false;
    }
    if (this.username) {
      log(`[${this.username}]`, "Attempt to refresh token", `${tries}/3`);
    }
    let response: any = undefined;
    try {
      let data: any = {
        query: `${this.query}${reff ? `` : ""}`,
      };
      if ((reff as any) != "") {
        data.referralToken = (reff as string).split("_")[1];
      }
      const request = await axios.post(
        BLUM_USER_DOMAIN + "/api/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP",
        data,
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
      if (!response?.token?.refresh) throw new Error("");
      this.token = response?.token?.refresh;
      if (response?.justCreated) {
        log(
          "success",
          `[${this.username}]`,
          `Just created account, using refferal: ${reff}`
        );
      }
      if (this.username) {
        log("success", `[${this.username}]`, "Token refreshed");
      }
      return;
    } catch (error: any) {
      log("danger", `[${this.username}]`, error);
    }
    return await this._refreshToken(tries + 1);
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
          return await this._getUserInfo();
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
    if (
      !this.username ||
      this.username == undefined ||
      this.username == "undefined"
    )
      await this._init();
    if (isRefresh) {
      await this._refreshToken();
    } else {
      // log("warning", `[${this.username}]`, errorData.toString());
    }
    return;
  };
  _init = async (i = 0) => {
    if (i >= 5) return;
    await sleep(getRandomInt(100, 1000));
    try {
      if (!this.token) {
        const tes = await this._refreshToken();
        if (!tes) throw new Error("");
      }
      const userInfo = await this._getUserInfo();
      if (!userInfo?.username || userInfo?.username == undefined) return false;
      this.username = userInfo.username;
      if (this.username == undefined || this.username == "undefined")
        return await this._init(i);
      return true;
    } catch (err) {
      i++;
      await sleep(getRandomInt(100, 2500));
      return await this._init(i);
    }
  };
  private _isTokenValid = (msg: string) => {
    if (!msg) return false;
    if (msg.toLowerCase().includes("token is invalid")) return true;
    if (msg.toLowerCase().includes("invalid jwt token")) return true;
    return false;
  };
  private _getFriendsBalance = async (showLog = true) => {
    if (showLog) {
      log(
        "info",
        `[${this.username}]`,
        "[FRIENDS]",
        "Checking friends balance"
      );
    }
    let response: any = undefined;
    try {
      const request = await axios.get(
        BLUM_USER_DOMAIN + "/api/v1/friends/balance",
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
          return await this._getFriendsBalance(false);
        }
        if (error.response?.data?.message == "User not found") {
          log(
            "danger",
            `[${this.username}]`,
            "Failed to check friends balance. Probably Phone Number banned."
          );
          return undefined;
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to check friends balance");
      }
      return undefined;
    }
  };
  private _claimFriendsBalance = async () => {
    // log("info", `[${this.username}]`, "[FRIENDS]", "Claiming friends balance");
    let response: any = undefined;
    try {
      const request = await axios.post(
        BLUM_USER_DOMAIN + "/api/v1/friends/claim",
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
          return await this._claimFriendsBalance();
        }
        await this._errorHandler(
          error?.response?.data?.message ?? error.response?.data,
          false
        );
      } else {
        log("danger", `[${this.username}]`, "Failed to claim friends balance");
      }
      return undefined;
    }
  };
  getUserInfo = async () => {
    return await this._getUserInfo();
  };
  getTaskOld = async (print: Boolean = false) => {
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
  getTask = async (print: Boolean = false) => {
    const tasks = await this._getTask();
    let allTask: any = [];
    if (!tasks) return allTask;
    allTask = [...allTask, ...tasks.flatMap((task: any) => task.tasks)];
    tasks.forEach((task: any) => {
      if (task?.subSections) {
        task?.subSections.forEach((subSection: any) => {
          subSection.tasks.forEach((task: any) => {
            allTask.push(task);
          });
        });
      }
      if (task?.tasks) {
        task?.tasks.forEach((t: any) => {
          if (t?.subTasks) {
            t.subTasks.forEach((subTask: any) => {
              allTask.push(subTask);
            });
          }
        });
      }
    });
    if (!print) return allTask;
    console.table(
      allTask.map((task: any) => ({
        // id: task.id,
        title: task.title,
        // kind: task.kind,
        status: task.status,
        type: task.type,
      }))
    );
    return allTask;
  };
  getBalance = async (print = true) => {
    const balance = await this._getBalance();
    if (balance) {
      if (print) {
        log("info", `[${this.username}]`, "Balance", balance.availableBalance);
      }
    }
  };
  run = async (safe = false) => {
    try {
      await sleep(getRandomInt(500, 2000));
      if (!this.token) await this._init();
      await Promise.all([
        this.runDailyReward(undefined, safe),
        this.runFarming(safe),
        this.runGame(undefined, safe),
        this.runTask(undefined, safe),
        this.runFriendsBalance(safe),
      ]);
      if (!safe) {
        await sleep(60 * 1000 * 8 + 60 * 1000 * 5);
        return await this.run();
      }
    } catch (err) {
      if (!safe) {
        await sleep(getRandomInt(500, 2000) * getRandomInt(1, 15));
        return await this.run();
      }
    }
  };

  runDailyReward = async (i = 0, safe = false) => {
    i++;
    const dailyReward = await this._dailyReward();
    if (dailyReward?.message === "OK") {
      log("success", `[${this.username}]`, "Claimed daily reward");
    } else if (dailyReward?.message === "same day") {
      log(`[${this.username}]`, "Already claimed today");
    } else if (dailyReward?.message === "Bad request") {
      if (i <= 5) {
        await sleep(getRandomInt(500, 1500));
        return await this.runDailyReward(i, safe);
      }
      log(`[${this.username}]`, "Already claimed today");
    } else {
      log("warning", `[${this.username}]`, "Daily reward not ready");
    }
    if (!safe) {
      await sleep(60 * 1000 * 60 * 8 + 1000 * 60 * 5);
      return await this.runDailyReward(0, safe);
    }
  };
  runFriendsBalance = async (safe = false) => {
    const friendsbalance = await this._getFriendsBalance();
    if (friendsbalance) {
      if (friendsbalance.canClaim) {
        const claim = await this._claimFriendsBalance();
        if (claim) {
          log(
            "success",
            `[${this.username}]`,
            "Claimed friends balance",
            `${friendsbalance.amountForClaim} points`,
            `(${friendsbalance.usedInvitation} friends)`
          );
          const friendsbalanceNew = await this._getFriendsBalance(false);
          if (friendsbalanceNew?.canClaimAt) {
            if (!safe) {
              await sleep(friendsbalance.canClaimAt - new Date().getTime());
            } else {
              log(`[${this.username}]`, "Friends balance not ready.");
            }
          }
          if (!safe) {
            await sleep(60 * 1000 * 60 * 8 + 15000);
            return await this.runFriendsBalance(safe);
          }
        } else {
          log("danger", `[${this.username}]`, "Failed claim friends balance");
        }
      } else {
        log(`[${this.username}]`, "No friends balance");
      }
    } else {
      log("danger", `[${this.username}]`, "Failed check friends balance");
    }
    if (!safe) {
      await sleep(60 * 1000 * 60 * 8 + 1000 * 60 * 5);
      return await this.runFriendsBalance(safe);
    }
  };
  runGame = async (i = 0, safe = false) => {
    if (i > 0) {
      if (!safe) {
        await sleep(getRandomInt(5000, 30 * 1000));
      } else {
        await sleep(getRandomInt(1000, 5 * 1000));
      }
      const gameResult = await this._startGame();
      if (gameResult?.gameId) {
        log(
          "success",
          `[${this.username}]`,
          "Game completed",
          gameResult.gameId
        );
        await this._claimGame(gameResult.gameId);
      }
      if (i - 1 > 0) return await this.runGame(i - 1, safe);
    } else {
      const balance = await this._getBalance();
      if (balance) {
        if (balance.playPasses > 0) {
          return await this.runGame(balance.playPasses, safe);
        }
        log(`[${this.username}]`, "No game passes");
      } else {
        log("info", `[${this.username}]`, "Failed to get game pass");
        if (!safe) await sleep(1000 * 60 * 5);
      }
    }
    if (!safe) {
      await sleep(1000 * 60 * 60 * 8 + 1000 * 60 * 5);
      return await this.runGame(0, safe);
    }
  };
  runFarming = async (safe = false) => {
    try {
      log(`[${this.username}]`, "[FARMING]");
      const balance = await this._getPoints();
      if (balance) {
        if (balance.farming) {
          if (new Date().getTime() >= balance.farming.endTime) {
            if (!safe) await sleep(1000 * 15);
            await this._claimFarming(balance.farming.balance);
            if (!safe) await sleep(1000 * 30);
            await this._startFarming();
            const nBalance = await this._getPoints();
            if (nBalance && nBalance?.farming) {
              if (!safe) {
                await sleep(
                  nBalance.farming.endTime -
                    new Date().getTime() +
                    1000 * 60 * 5
                );
              }
            }
            if (!safe) await sleep(1000 * 60 * 60 * 4);
          } else {
            if (new Date().getTime() - balance.farming.endTime <= 0) {
              if (!safe) {
                await sleep(
                  (new Date().getTime() -
                    balance.farming.endTime +
                    1000 * 60 * 5) *
                    -1
                );
              }
            }
          }
        } else {
          log(`[${this.username}]`, "Farming not started.");
          await this._startFarming();
          if (!safe) await sleep(60 * 1000 * 5);
        }
      } else {
        log("info", `[${this.username}]`, "Failed to get balance (farming)");
        if (!safe) await sleep(60 * 1000 * 60 * 1);
      }
      if (!safe) return await this.runFarming(safe);
    } catch (err) {
      console.log(err);
    }
  };
  runTask = async (print: Boolean = false, safe = false) => {
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
              this._startTask({ id: task.id, title: task.title })
            )
        );
        if (!safe) await sleep(getRandomInt(1000, 5000));
        tasks = await this.getTask(print);
        if (
          tasks.filter((task: any) => task.status == "READY_FOR_VERIFY")
            .length > 0
        ) {
          log("info", `[${this.username}]`, "Verifying task...");
          const keywords = {
            "38f6dd88-57bd-4b42-8712-286a06dac0a0": "VALUE",
            "6af85c01-f68d-4311-b78a-9cf33ba": "GO GET",
            "d95d3299-e035-4bf6-a7ca-0f71578e9197": "BEST PROJECT EVER",
          };
          await Promise.all(
            tasks
              .filter(
                (task: any) =>
                  task.status == "READY_FOR_VERIFY" &&
                  task.validationType == "KEYWORD"
              )
              .map((task: any) =>
                sleep(getRandomInt(1000, 5000)).then(() => {
                  if (keywords[task.id]) {
                    if (keywords[task.id] != "") {
                      this._verifyTask({
                        id: task.id,
                        title: task.title,
                        keyword: keywords[task.id],
                      });
                    }
                  }
                })
              )
          );
        }
        await sleep(getRandomInt(1000, 5000));
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
                sleep(getRandomInt(500, 8000)).then(() => {
                  this._claimTask({ id: task.id, title: task.title });
                })
              )
          );
        }
      } else {
        log(`[${this.username}]`, "No tasks to run");
      }
    } else {
      log("danger", `[${this.username}]`, "Failed to run task");
    }
    if (!safe) {
      await sleep(60 * 1000 * 60 * 8);
      return await this.runTask(print, safe);
    }
  };

  getTribe = () => {
    return TRIBE;
  };
}
