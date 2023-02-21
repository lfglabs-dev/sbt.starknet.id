import styles from "@/styles/components/steps.module.css";
import React, { FunctionComponent } from "react";

type SuccessProps = {
  transactionHash: string;
};

const LookAndFeel: FunctionComponent<SuccessProps> = ({
  transactionHash,
  ...props
}) => {
  return (
    <div {...props}>
      <h2 className={styles.subtitle}>
        Your SBT contract has been successfully deployed
      </h2>
      <a
        className={styles.viewTX}
        href={`https://testnet.starkscan.co/tx/${transactionHash}`}
        target="_blank"
        rel="noreferrer"
      >
        View on starkscan
      </a>
    </div>
  );
};

export default LookAndFeel;
