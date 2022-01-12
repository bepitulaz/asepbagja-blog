import React, { useEffect } from "react";
import { useRouter } from "next/router";
import PlausibleProvider from "next-plausible";
import * as ga from "../libs/ga";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <PlausibleProvider domain="asepbagja.com" trackOutboundLinks={true}>
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}
export default MyApp;
