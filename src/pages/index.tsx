import styles from "@/styles/Home.module.css"
import React, { ReactElement, useState } from "react";
import LookAndFeel from "@/components/lookAndFeel";
import { useAccount } from "@starknet-react/core";
import Deploy from "@/components/deploy";
import Connect from "@/components/connection/connect";

export default function Home() {
  const [tokenURI, setTokenURI] = useState<string>("");
  const [menu, setMenu] = useState<ReactElement | null>(null);
  const { address } = useAccount();

  return (
    <main className={styles.page}>
      <section className={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <div className={[styles.sidesContainer, !address ? styles.blur : ""].join(" ")}>
            <img className={styles.formSideImage} />
            <div className={styles.formFields}>
              <h1 className={styles.title}>sbtmaker</h1>
              {
                !tokenURI ? <LookAndFeel setMenu={setMenu} setTokenURI={setTokenURI} />
                : <Deploy setMenu={setMenu} tokenURI={tokenURI} />
              }
            </div>
          </div>
          { !address ? <Connect /> : null }
        </form>
      </section>
      {menu}
    </main>
  )
}
