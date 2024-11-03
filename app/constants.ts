export const STORAGE_KEYS = {
  USER: "u",
  ACCESS_TOKEN: "at",
  REFRESH_TOKEN: "rt",
  GENERAL_SETTINGS: "gs",
};

export const USER_TYPES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

export const ROLE_TYPES = {
  ...USER_TYPES,
};

export const SETTING_KEYS = {
  SYSTEM: {
    AUTH: {
      METHOD: "system.auth.method",
    },
    COMPANY: {
      NAME: "system.company.name",
    },
  },
  NOTIFICATION: {
    EMAIL: {
      SENDER: "notification.email.sender",
      TYPE: "notification.email.type",
      HOST: "notification.email.host",
      PORT: "notification.email.port",
      SSL: "notification.email.ssl",
      USER: "notification.email.user",
      PASS: "notification.email.pass",
      SENDER_NAME: "notification.email.sender.name",
      SENDER_EMAIL: "notification.email.sender.email",
      API_KEY: "notification.email.mailgun.api_key",
      DOMAIN: "notification.email.mailgun.domain",
    },
  },
  AUTH: {
    CONTACT: {
      WHITELIST: "auth.contact.whitelist",
    },
  },
  TERMS_OF_USE: "terms_of_use",
  PRIVACY_POLICY: "privacy_policy",
  REFUND_POLICY: "refund_policy",
  FAQ: "faq",
};

export const SEVERITIES = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  NOTICE: "NOTICE",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL",
  ALERT: "ALERT",
  EMERGENCY: "EMERGENCY",
};

export const AUTH_METHODS = {
  LOCAL: "local",
};

export const LOG_TYPES = {
  AUDIT: "audit",
  SYSTEM: "system",
};

// ___

export const APP = {
  FORM_INPUT_SIZE: "middle",
  FORM_INPUT_SIZE_SMALL: "small",
  DATETIME_FORMAT: "DD MMM YYYY HH:mm:ss",
  DATETIME_NOSEC_FORMAT: "DD MMM YYYY HH:mm",
  DATE_FORMAT: "DD MMM YYYY",
  TIME_FORMAT: "HH:mm A",
  CURRENCY: "RM",
  TIMEZONE: "Asia/Kuala_Lumpur",
  WEIGHT: "KG",
};
