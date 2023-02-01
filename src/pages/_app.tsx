import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { InjectedConnector, StarknetProvider } from "@starknet-react/core"

const connectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
];
export default function App({ Component, pageProps }: AppProps) {
  return <StarknetProvider connectors={connectors}> <Component {...pageProps} />  </StarknetProvider>
}
