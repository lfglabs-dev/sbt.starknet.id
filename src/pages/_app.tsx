import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { InjectedConnector, StarknetProvider } from "@starknet-react/core";
import { ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";

const connectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
];
export default function App({ Component, pageProps }: AppProps) {
  return (
    <StarknetProvider connectors={connectors}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </StarknetProvider>
  );
}
