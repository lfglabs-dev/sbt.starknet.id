import React, { useState, useEffect } from "react";
import { useConnectors, useAccount, useStarknet } from "@starknet-react/core";
import { useDisplayName } from '@/hooks/displayname';
import WalletSelector from '@/components/connection/walletSelector';
import styles from '@/styles/components/connection/Connect.module.css'
import Button from "../UI/button";

export default function Connect() {

    // connection
    const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);

    // starknet-react
    const { address } = useAccount();
    const { available, connect, disconnect } = useConnectors();
    const displayname = useDisplayName(address);
    const { library } = useStarknet();

    useEffect(() => {
        if (!address) return;

        const STARKNET_NETWORK = {
            mainnet: "0x534e5f4d41494e",
            testnet: "0x534e5f474f45524c49",
        };

        if (library.chainId === STARKNET_NETWORK.testnet && process.env.NEXT_PUBLIC_NETWORK === "mainnet") {
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

    return (
        <>
            <div className={styles.buttonContainer}>
                <Button onClick={
                    address
                        ? () => disconnectByClick()
                        : available.length === 1
                            ? () => connect(available[0])
                            : () => setShowWalletSelector(true)}>
                {address ? displayname : "connect"}
                </Button>
            </div>
            {isWrongNetwork
                ? <div>wrong network</div>
                : showWalletSelector
                    ? <WalletSelector closeWalletSelector={() => setShowWalletSelector(false)} />
                    : <></>}
        </>
    )
}
