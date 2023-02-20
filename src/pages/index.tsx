import styles from "@/styles/home.module.css";
import React, { ReactElement, useState } from "react";
import LookAndFeel from "@/components/lookAndFeel";
import { useAccount } from "@starknet-react/core";
import Deploy from "@/components/deploy";
import Connect from "@/components/connection/connect";
import Success from "@/components/success";

export default function Home() {
  const [tokenURI, setTokenURI] = useState<string>("");
  const [menu, setMenu] = useState<ReactElement | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [finalStep, setFinalStep] = useState<boolean>(false);
  const { address } = useAccount();

  return (
    <main className={styles.page}>
      <section className={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <div
            className={[
              styles.sidesContainer,
              !address ? styles.blur : "",
            ].join(" ")}
          >
            <div className={styles.formSideImage} />
            <div className={styles.formFields}>
              <h1 className={styles.title}>sbtmaker</h1>
              {finalStep ? (
                <Success transactionHash={transactionHash} />
              ) : !tokenURI ? (
                <LookAndFeel setMenu={setMenu} setTokenURI={setTokenURI} />
              ) : (
                <Deploy
                  setMenu={setMenu}
                  tokenURI={tokenURI}
                  transactionHash={transactionHash}
                  setTransactionHash={setTransactionHash}
                  setFinalStep={setFinalStep}
                />
              )}
            </div>
          </div>
          <Connect />
        </form>
      </section>
      {menu}
    </main>
  );
}
