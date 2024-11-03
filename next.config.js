const path = require("path");
const packageJson = require("./package.json");

const withPlugins = require("next-compose-plugins");
const withLess = require("next-with-less");
const withImages = require("next-images");

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/portal",
        destination: "/portal/message",
        permanent: true,
      },
    ];
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    NEXT_PUBLIC_API_FILE_HOST: process.env.NEXT_PUBLIC_API_FILE_HOST,
    NEXT_PUBLIC_API_TIMEOUT_MS: process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_POWERED_BY: process.env.NEXT_PUBLIC_APP_POWERED_BY,
    NEXT_PUBLIC_APP_POWERED_BY_WEBSITE: process.env.NEXT_PUBLIC_APP_POWERED_BY_WEBSITE,
    NEXT_PUBLIC_VERSION: packageJson.version,
  },
  serverRuntimeConfig: {
    NEXT_BACKEND_API_HOST: process.env.NEXT_BACKEND_API_HOST,
    NEXT_BACKEND_API_TIMEOUT_MS: process.env.NEXT_BACKEND_API_TIMEOUT_MS,
    NEXT_BACKEND_SECURE_KEY: process.env.NEXT_BACKEND_SECURE_KEY,
  },
};

module.exports = withPlugins(
  [
    withLess({
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
          localIdentName: "[path]___[local]___[hash:base64:5]",
        },
      },
    }),
    withImages,
  ],
  nextConfig
);
