import React from "react";
import PlausibleProvider from "next-plausible";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="asepbagja.com" trackOutboundLinks={true}>
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}
export default MyApp;
