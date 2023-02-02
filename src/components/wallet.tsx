import { useConnectors, useAccount, useStarknet } from "@starknet-react/core";
import { useMinified, useUpdatedDomainFromAddress } from '@/hooks/displayname';
import { useState } from "react";
import styles from '@/styles/components/Wallet.module.css';

export default function Wallet() {
    // connection
    const [hasWallet, setHasWallet] = useState<boolean>(true);
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);

    // starknet-react
    const { address } = useAccount();
    const { available, connect, disconnect } = useConnectors();

    const domain = useUpdatedDomainFromAddress(address);

    function disconnectByClick(): void {
        disconnect();
        setIsWrongNetwork(false);
    }

    return <div className={styles.container}>
        <button
    className="button"
    onClick={
      address
        ? () => disconnectByClick()
        : available.length === 1
          ? () => connect(available[0])
          : () => setHasWallet(true)
    }
  >
    {address ? (
      <div>
        {domain
          ? useMinified(domain)
          : useMinified(address ?? "")}
      </div>
    ) : (
      "connect"
    )}
  </button>
  </div>
}