import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "katex/dist/katex.min.css";
import Adsense from "../components/Adsense";
import Analytics from "../components/Analytics";
import ErrorBoundary from "../components/ErrorBoundary";
import { SessionProvider } from "next-auth/react";

export const BootstrapLibContext = React.createContext<any>(null);

export default function MassachusettsCodingLeague({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): JSX.Element {
  const [bootstrapLib, setBootstrapLib] = React.useState<any>(null);

  React.useEffect(() => {
    import("bootstrap").then((bsLib) => {
      setBootstrapLib(bsLib);
    });
  }, []);

  return (
    <ErrorBoundary>
      <NextNProgress color="#44FFFF" options={{ showSpinner: false }} />
      <Analytics />
      <Adsense />
      <SessionProvider session={session}>
        <BootstrapLibContext.Provider value={bootstrapLib}>
          <Component {...pageProps} />
        </BootstrapLibContext.Provider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
