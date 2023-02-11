import React, { FunctionComponent, ReactNode } from "react";
import styles from "@/styles/components/screens/loadingScreen.module.css";
import Loading from "../loading";

type LoadingScreenProps = {
  message: string;
};

const LoadingScreen: FunctionComponent<LoadingScreenProps> = ({ message }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.message}>{message}</h2>
        <Loading />
      </div>
    </div>
  );
};

export default LoadingScreen;
