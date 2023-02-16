import React, { useState, useEffect, FunctionComponent } from "react";
import { useConnectors, useAccount, useStarknet } from "@starknet-react/core";
import Button from "../UI/button";
import ModalMessage from "../UI/modalMessage";
import styles from "@/styles/components/connection/networkSelector.module.css";

type SbtNetworkSelectorProps = {
  isMainnet: boolean;
};

const SbtNetworkSelector: FunctionComponent<SbtNetworkSelectorProps> = ({
  isMainnet,
}) => {
  // connection
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // starknet-react
  const { address } = useAccount();
  const { disconnect } = useConnectors();
  const { library } = useStarknet();

  useEffect(() => {
    if (!address) return;

    const STARKNET_NETWORK = {
      mainnet: "0x534e5f4d41494e",
      testnet: "0x534e5f474f45524c49",
    };

    if (isMainnet && library.chainId === STARKNET_NETWORK.testnet) {
      setIsWrongNetwork(true);
    } else if (!isMainnet && library.chainId === STARKNET_NETWORK.mainnet) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [library, address, isMainnet]);

  function disconnectByClick(): void {
    disconnect();
    setIsWrongNetwork(false);
  }

  return isWrongNetwork ? (
    <ModalMessage
      open={true}
      title={"Wrong network"}
      closeModal={() => setIsWrongNetwork(false)}
      message={
        <div className={styles.container}>
          <p>
            This SBT can only be minted on Starknet{" "}
            {isMainnet ? "mainnet" : "testnet"}, you have to change your network
            to mint your SBT token.
          </p>
          <div className={styles.disconnectButton}>
            <Button onClick={() => disconnectByClick()}>Disconnect</Button>
          </div>
        </div>
      }
    />
  ) : null;
};

export default SbtNetworkSelector;
