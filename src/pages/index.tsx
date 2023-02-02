import styles from '@/styles/Home.module.css'
import React, { useState } from "react";
import LookAndFeel from '@/components/lookAndFeel';
import { useAccount } from '@starknet-react/core';
import Deploy from '@/components/deploy';
import Connect from '@/components/connection/connect';

export default function Home() {
  const [tokenURI, setTokenURI] = useState<string>('');
  const { address } = useAccount();

  return <main className={styles.page}>
    <a className={styles.homeButton} href="https://starknet.id/" target="_blank" rel="noreferrer">
      <img width={80} src="/visuals/StarknetidLogo.png" />
    </a>
    <section className={styles.formContainer}>
      <h1 className={styles.title}>sbtmaker</h1>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        {
          !tokenURI ? <LookAndFeel setTokenURI={setTokenURI} className={!address ? styles.blur : ''} />
          : <Deploy tokenURI={tokenURI} />
        }
        { !address ? <Connect /> : null }
      </form>
    </section>
    <img className={styles.leaf1} src="/leaves/leaf_3.png" />
    <img className={styles.leaf2} src="/leaves/leaf_2.png" />
  </main>
}
