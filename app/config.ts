import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const APP = {
  VERSION: publicRuntimeConfig.NEXT_PUBLIC_VERSION,
  NAME: publicRuntimeConfig.NEXT_PUBLIC_APP_NAME,

  TIMEZONE: publicRuntimeConfig.NEXT_PUBLIC_TIMEZONE,
  CURRENCY: publicRuntimeConfig.NEXT_PUBLIC_CURRENCY,
  COUNTRY_CODE: publicRuntimeConfig.NEXT_PUBLIC_COUNTRY_CODE,
  WEIGHT: publicRuntimeConfig.NEXT_PUBLIC_WEIGHT,
  DIMENSION: publicRuntimeConfig.NEXT_PUBLIC_DIMENSION,
  DATE_FORMAT: publicRuntimeConfig.NEXT_PUBLIC_DATE_FORMAT,
  TIME_FORMAT: publicRuntimeConfig.NEXT_PUBLIC_TIME_FORMAT,
  SST: publicRuntimeConfig.NEXT_PUBLIC_SST,
};

export const SECURE = {
  KEY: publicRuntimeConfig.NEXT_PUBLIC_KEY,
};
export const API = {
  HOST: publicRuntimeConfig.NEXT_PUBLIC_API_HOST,
  TIMEOUT: publicRuntimeConfig.NEXT_PUBLIC_API_TIMEOUT_MS ? Number(publicRuntimeConfig.NEXT_PUBLIC_API_TIMEOUT_MS) : 30000,
  FILE_HOST: publicRuntimeConfig.NEXT_PUBLIC_API_FILE_HOST,
} as { FILE_HOST: string; HOST: string; TIMEOUT: number };
