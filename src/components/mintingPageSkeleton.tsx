import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@/styles/minting.module.css";

const MintingPageSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className={[styles.textSection, styles.skeletonSection].join(" ")}>
        <Skeleton variant="rectangular" width={400} height={70} />
        <Skeleton variant="rectangular" width={400} height={150} />
      </div>
    </>
  );
};

export default MintingPageSkeleton;
