import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "@/stores/index";
import Head from "next/head";
import * as CONFIG from "@/app/config";
import { App } from "@/app/index";
import "@/styles/globals.less";

export const RootApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Head>
        <title>{CONFIG.APP.NAME}</title>
        <meta name="robots" content="noindex" />
        <meta name="googlebot" content="noindex" />
      </Head>
      <PersistGate loading={null} persistor={persistor}>
        <App>
          <Component {...pageProps} />
        </App>
      </PersistGate>
    </Provider>
  );
};

RootApp.getInitialProps = async () => {
  // A page that relies on publicRuntimeConfig must use getInitialProps to opt-out of Automatic Static Optimization.
  // Runtime configuration won't be available to any page (or component in a page) without getInitialProps.
  // refer https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
  return {};
};

export default RootApp;
