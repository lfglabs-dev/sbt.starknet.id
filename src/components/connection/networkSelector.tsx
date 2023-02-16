import React, { useEffect, FunctionComponent } from "react";
import { useConnectors, useAccount, useStarknet } from "@starknet-react/core";
import Button from "../UI/button";
import ModalMessage from "../UI/modalMessage";
import styles from "@/styles/components/connection/NetworkSelector.module.css";

type NetworkSelectorProps = {
  isWrongNetwork: boolean;
  setIsWrongNetwork: (isWrongNetwork: boolean) => void;
};

const NetworkSelector: FunctionComponent<NetworkSelectorProps> = ({
  isWrongNetwork,
  setIsWrongNetwork,
}) => {
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
    if (
      library.chainId === STARKNET_NETWORK.testnet &&
      process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ) {
      setIsWrongNetwork(true);
    } else if (
      library.chainId === STARKNET_NETWORK.mainnet &&
      process.env.network === "testnet"
    ) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [library, address]);

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
            This app only supports Starknet {process.env.NEXT_PUBLIC_NETWORK},
            you have to change your network to be able use it.
          </p>
          <div className={styles.disconnectButton}>
            <Button onClick={() => disconnectByClick()}>Disconnect</Button>
          </div>
        </div>
      }
    />
  ) : null;
};

export default NetworkSelector;
