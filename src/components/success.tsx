import Button from "./UI/button";
import styles from "@/styles/components/Steps.module.css";

interface LookAndFeelProps {
  transactionHash: string;
}

export default function Success({
  transactionHash,
  ...props
}: LookAndFeelProps) {
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
}
