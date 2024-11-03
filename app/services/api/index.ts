import axios from "axios";
import * as CONFIG from "@/app/config";
import { storage } from "@/app/services";
import { STORAGE_KEYS } from "@/app/constants";

import { Auth } from "./auth";
import { Setting } from "./setting";

import { User } from "./user";
import { Office } from "./office";
import { Log } from "./log";
import { Notifications } from "./notifications";

const http = axios.create({
  baseURL: CONFIG.API.HOST,
  timeout: CONFIG.API.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});
http.interceptors.request.use(
  (config) => {
    const token = storage.local.get.value(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => {
    // do nothing on response (direct response the data)
    return response ? response.data : null;
  },
  async (error) => {
    let res = error;
    if (error) {
      if (error.response && error.response.data) {
        if (error.response.data.type === "application/json") {
          res = JSON.parse(await error.response.data.text());
        } else if (error?.response?.headers?.["content-type"].indexOf("/json") > 0) {
          res = error.response.data;
        }
      } else {
        res = {
          message: error.message,
          statusCode: error.status,
          error,
        };
      }
    }

    if (res.statusCode === 401) {
      if (storage.local.has(STORAGE_KEYS.ACCESS_TOKEN) && !res.message) {
        res.message = `Session expired`;
      }
    }
    return Promise.reject(res);
  }
);

export const services = {
  auth: new Auth(http),
  setting: new Setting(http),
  user: new User(http),
  office: new Office(http),
  log: new Log(http),
  notification: new Notifications(http),
};
