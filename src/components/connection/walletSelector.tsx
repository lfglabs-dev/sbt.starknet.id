import React from "react";
import { Connector, useConnectors } from "@starknet-react/core";
import WalletIcons from "./walletIcons";
import styles from '@/styles/components/connection/WalletSelector.module.css'

export default function WalletSelector({ closeWalletSelector }: { closeWalletSelector: () => void; }) {

  const { connect, connectors } = useConnectors();
  function connectWallet(connector: Connector): void {
    connect(connector);
    closeWalletSelector();
  }

  return <div className={styles.box}>
    <div className={styles.title}>You need a Starknet wallet</div>
    {connectors.map((connector) => {
      if (connector.available()) {
        return (
          <button className={styles.wallet_button} key={connector.id()} onClick={() => connectWallet(connector)}>

            <WalletIcons id={connector.id()} />
            <div className={styles.wallet_buton_txt} >{`Connect ${connector.name()}`}</div>

          </button>
        );
      }
    })}
  </div>
}