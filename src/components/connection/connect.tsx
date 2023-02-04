import React, { useState, useEffect } from "react";
import { useConnectors, useAccount, useStarknet } from "@starknet-react/core";
import { useDisplayName } from '@/hooks/displayname';
import WalletSelector from '@/components/connection/walletSelector';
import styles from '@/styles/components/connection/Connect.module.css'
import Button from "../UI/button";

export default function Connect() {
    // connection
    const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);

    // starknet-react
    const { address } = useAccount();
    const { available, connect, disconnect } = useConnectors();
    const displayname = useDisplayName(address);


    function disconnectByClick(): void {
        disconnect();
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
            {showWalletSelector
                    ? <WalletSelector closeWalletSelector={() => setShowWalletSelector(false)} />
                    : <></>}
        </>
    )
}
