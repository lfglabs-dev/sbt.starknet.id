import Button from "./UI/button";
import styles from "@/styles/components/Steps.module.css";

type LookAndFeelProps = {
  transactionHash: string;
};

const LookAndFeel = ({ transactionHash, ...props }: LookAndFeelProps) => {
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
