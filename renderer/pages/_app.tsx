import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { theme, createEmotionCache } from "../theme";
import { SessionProvider } from "next-auth/react";
import { ModulesProvider } from "../hooks/modules";
import Layout from "../components/Layout/layout";
import "../theme/tailwind.css";
import "../theme/dist/output.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session: any;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <SessionProvider session={(pageProps as { session: any }).session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <ModulesProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModulesProvider>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
