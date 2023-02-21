import React, { FunctionComponent, useState } from "react";
import { useConnectors, useAccount } from "@starknet-react/core";
import { useDisplayName } from "@/hooks/displayname";
import styles from "@/styles/components/connection/connect.module.css";
import Button from "../UI/button";
import Wallets from "../UI/wallets";
import NetworkSelector from "@/components/connection/networkSelector";

const Connect: FunctionComponent = () => {
  // connection
  const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // starknet-react
  const { address } = useAccount();
  const { connectors } = useConnectors();
  const { available, connect, disconnect } = useConnectors();
  const displayname = useDisplayName(address);

  function disconnectByClick(): void {
    disconnect();
  }

  return (
    <>
      {!address ? (
        <>
          <div className={styles.buttonContainer}>
            <Button
              onClick={
                address
                  ? () => disconnectByClick()
                  : available.length === 1
                  ? () => connect(available[0])
                  : () => setShowWalletSelector(true)
              }
            >
              {address ? displayname : "connect"}
            </Button>
          </div>
          {showWalletSelector ? (
            <Wallets
              hasWallet={Boolean(connectors.length && !isWrongNetwork)}
              closeWallet={() => setShowWalletSelector(false)}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <NetworkSelector
          isWrongNetwork={isWrongNetwork}
          setIsWrongNetwork={setIsWrongNetwork}
        />
      )}
    </>
  );
};

export default Connect;
