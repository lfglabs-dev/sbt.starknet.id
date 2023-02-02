import React from "react";
import { Connector, useConnectors } from "@starknet-react/core";
import WalletIcons from "./walletIcons";

export default function WalletSelector({ closeWalletSelector }: { closeWalletSelector: () => void; }) {

  const { connect, connectors } = useConnectors();
  function connectWallet(connector: Connector): void {
    connect(connector);
    closeWalletSelector();
  }

  return <div>
    Chose a wallet
    {connectors.map((connector) => {
      if (connector.available()) {
        return (
          <button key={connector.id()} onClick={() => connectWallet(connector)}>
            <div className="flex">
              <WalletIcons id={connector.id()} />
              {`Connect ${connector.name()}`}
            </div>
          </button>
        );
      }
    })}
  </div>
}