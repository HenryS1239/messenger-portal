//import * as CryptoJs from 'crypto-js';
import { SECURE } from "@/app/config";
import { isArray } from "lodash";

// const crypto = CryptoJs.AES;

const SECURE_KEY = SECURE.KEY;

// TODO: crypto-js in ts
const security = {
  /*encrypt: (value: any) => SECURE_KEY ? crypto.encrypt(value, SECURE_KEY) : value,
    decrypt: (encrypted: any) => SECURE_KEY ? crypto.decrypt(encrypted, SECURE_KEY).toString(CryptoJs.enc.Utf8) : encrypted,*/
  encrypt: (value: any) => value,
  decrypt: (encrypted: any) => encrypted,
};

export const storage = {
  set: (name: string, data: any[]) =>
    localStorage.setItem(name, JSON.stringify(data)),
  get: (name: string) => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      localStorage.getItem(name);
      const data = localStorage.getItem(name);
      if (data === null || data === undefined) {
        return [];
      } else {
        return JSON.parse(data);
      }
    }
  },
  remove: (key: string) => localStorage.removeItem(key),
  has: (key: string) => window.localStorage.getItem(key) !== null,
};

export const local = {
  remove: (key: string) => localStorage.removeItem(key),
  set: (key: string, value: any) => {
    const v = typeof value === "object" ? JSON.stringify(value) : value;
    return localStorage.setItem(key, security.encrypt(v));
  },
  has: (key: string) => localStorage.getItem(key) !== null,
  get: {
    value: (key: string, defaultValue = null): any => {
      const v = localStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return security.decrypt(v);
    },
    object: (key: string, defaultValue: any = null): any => {
      const v = localStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return JSON.parse(security.decrypt(v));
    },
  },
};

export const session = {
  remove: (key: string) => sessionStorage.removeItem(key),
  set: (key: string, value: any) => {
    const v = typeof value === "object" ? JSON.stringify(value) : value;
    return sessionStorage.setItem(key, security.encrypt(v));
  },
  has: (key: string) => sessionStorage.getItem(key) !== null,
  get: {
    value: (key: string, defaultValue = null): any => {
      const v = sessionStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return security.decrypt(v);
    },
    object: (key: string, defaultValue: any = null): any => {
      const v = sessionStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return JSON.parse(security.decrypt(v));
    },
  },
};
