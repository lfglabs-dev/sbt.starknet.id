import React, { FunctionComponent } from "react";
import { Connector, useConnectors } from "@starknet-react/core";
import WalletIcons from "./walletIcons";
import styles from "@/styles/components/connection/walletSelector.module.css";

type WalletSelectorProps = {
  closeWalletSelector: () => void;
};

const WalletSelector: FunctionComponent<WalletSelectorProps> = ({
  closeWalletSelector,
}) => {
  const { connect, connectors } = useConnectors();
  function connectWallet(connector: Connector): void {
    connect(connector);
    closeWalletSelector();
  }

  return (
    <div className={styles.box}>
      <div onClick={closeWalletSelector}>
        <svg className={styles.close} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <div className={styles.title}>You need a Starknet wallet</div>
      {connectors.map((connector) => {
        if (connector.available()) {
          return (
            <button
              className={styles.wallet_button}
              key={connector.id()}
              onClick={() => connectWallet(connector)}
            >
              <WalletIcons id={connector.id()} />
              <div
                className={styles.wallet_buton_txt}
              >{`Connect ${connector.name()}`}</div>
            </button>
          );
        }
      })}
    </div>
  );
};

export default WalletSelector;
