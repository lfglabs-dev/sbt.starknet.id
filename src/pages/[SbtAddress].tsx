import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransaction,
} from "@starknet-react/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import BN from "bn.js";
import { ec, GetTransactionResponse, hash } from "starknet";
import Button from "@/components/UI/button";
import SelectIdentity from "@/components/selectIdentity";
import Connect from "@/components/connection/connect";
import styles from "@/styles/minting.module.css";
import sbt_abi from "@/abi/starknet/sbt_abi.json";
import { TextField } from "@mui/material";
import LoadingScreen from "@/components/UI/screens/loadingScreen";
import MintingPageSkeleton from "@/components/mintingPageSkeleton";

type MetadataProps = {
  name: string;
  description: string;
  image: string;
};

type CallDataProps = {
  calldata: (string | number)[];
  contractAddress: string;
  entrypoint: string;
};

type TransactionDatas = {
  status: string;
};

const SbtMintingPage: NextPage = () => {
  const router = useRouter();
  const { SbtAddress } = router.query;

  const { account, address } = useAccount();
  const [contractAddress, setContractAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<BN>();
  const [tokenId, setTokenId] = useState<string>("0");
  const [password, setPassword] = useState<string>("");
  const [sbtData, setSbtData] = useState<MetadataProps>();
  const [callData, setCallData] = useState<CallDataProps[]>();
  const [element, setElement] = useState<ReactElement | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [clickedMint, setClickedMint] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [finalStep, setFinalStep] = useState<boolean>(false);
  const {
    data: transactionData,
    loading: transactionLoading,
    error: transactionError,
  } = useTransaction({ hash: transactionHash });

  const { execute } = useStarknetExecute({
    calls: callData,
  });
  const { contract } = useContract({
    address: contractAddress,
    abi: sbt_abi,
  });
  const { data, loading } = useStarknetCall({
    contract,
    method: "get_uri",
    args: [1],
    options: {
      watch: false,
    },
  });

  useEffect(() => {
    setContractAddress(SbtAddress as string);
  }, [SbtAddress]);

  useEffect(() => {
    if (!loadingMessage) {
      setElement(null);
    } else {
      setElement(<LoadingScreen message={loadingMessage} />);
    }
  }, [loadingMessage]);

  useEffect(() => {
    if (!transactionData || !clickedMint) return;
    const status = (
      transactionData as GetTransactionResponse & TransactionDatas
    ).status;
    setLoadingMessage(status);
    if (status === "ACCEPTED_ON_L2" || status === "ACCEPTED_ON_L1") {
      setLoadingMessage("");
      setFinalStep(true);
    }
  }, [transactionData, transactionLoading, transactionError]);

  useEffect(() => {
    if (!sbtData && data) {
      let dataUri = "";
      data[0].forEach((c: number) => {
        dataUri += String.fromCharCode(c);
      });
      const metadataUri = dataUri.replace(
        "ipfs://",
        "https://gateway.pinata.cloud/ipfs/"
      );
      fetch(metadataUri)
        .then((response) => response.json())
        .then((metadata) => {
          setSbtData(metadata);
        });
    }
  });

  useEffect(() => {
    if (account && clickedMint && callData && !finalStep) {
      execute().then((tx) => {
        setLoadingMessage((tx as any).code);
        setTransactionHash(tx.transaction_hash);
      });
    }
  }, [callData, clickedMint]);

  function changeTokenId(value: string): void {
    setTokenId(value);
  }

  function changePassword(value: string): void {
    setPassword(value);
  }

  function updateCallData(): void {
    const actualTokenId =
      tokenId && tokenId != "0"
        ? tokenId
        : Math.floor(Math.random() * 9999999999);
    const sbt_id = new BN(Math.floor(Math.random() * 9999999999));
    const hashed = hash.pedersen([sbt_id, actualTokenId]);
    const sbt_key = ec.genKeyPair();
    const sbt_proof = ec.sign(sbt_key, hashed);
    const whitelist_sig = ec.sign(ec.getKeyPair(privateKey as BN), hashed);
    const calls =
      tokenId === actualTokenId
        ? []
        : [
            {
              contractAddress: process.env
                .NEXT_PUBLIC_STARKNETID_CONTRACT as string,
              entrypoint: "mint",
              calldata: [actualTokenId],
            },
          ];
    calls.push({
      contractAddress: contractAddress,
      entrypoint: "claim",
      calldata: [
        sbt_id.toString(),
        actualTokenId,
        ec.getStarkKey(sbt_key),
        sbt_proof[0],
        sbt_proof[1],
        whitelist_sig[0],
        whitelist_sig[1],
      ],
    });
    calls.push({
      contractAddress: process.env.NEXT_PUBLIC_STARKNETID_CONTRACT as string,
      entrypoint: "equip",
      calldata: [contractAddress, sbt_id.toString()],
    });
    setCallData(calls);
    setClickedMint(true);
  }

  function handlePassword() {
    const textAsBuffer = new TextEncoder().encode(password.toLowerCase());
    (async () => {
      const hashBuffer = await window.crypto.subtle.digest(
        "SHA-256",
        textAsBuffer
      );
      const privateKey = new BN(new Uint8Array(hashBuffer)).mod(
        new BN(
          "3618502788666131213697322783095070105526743751716087489154079457884512865583"
        )
      );
      setPrivateKey(privateKey);
    })();
  }

  return (
    <>
      <main className={styles.main}>
        <div className={[styles.card, !address ? styles.blur : ""].join(" ")}>
          <img
            className={styles.identityTokenImage}
            src={
              sbtData
                ? sbtData?.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                : "/visuals/sbtIllustration.webp"
            }
            alt="SBT image"
          />
          <div className={styles.textSection}>
            {privateKey ? (
              finalStep ? (
                <>
                  <h1 className={styles.title}>
                    Your SBT was minted successfully
                  </h1>
                  <p className={styles.text}>
                    <a
                      href={`${process.env.NEXT_PUBLIC_STARKSCAN_LINK}/tx/${transactionHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View transaction on Starkscan
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <h1 className={styles.title}>It&apos;s almost done</h1>
                  <div className={styles.identitySection}>
                    <SelectIdentity
                      tokenId={tokenId}
                      changeTokenId={changeTokenId}
                    />
                    <Button onClick={updateCallData}>Mint my token</Button>
                  </div>
                </>
              )
            ) : loading ? (
              <MintingPageSkeleton />
            ) : (
              <>
                <h1 className={styles.title}>
                  {sbtData && !loading ? sbtData?.name : "SBT not found"}
                </h1>
                <p className={styles.text}>
                  {sbtData && !loading
                    ? sbtData?.description
                    : `We could not find the SBT at ${contractAddress} address, please try another one.`}
                </p>
                <div className={styles.password}>
                  {account && sbtData ? (
                    <>
                      <TextField
                        fullWidth
                        type="password"
                        placeholder="Password"
                        variant="outlined"
                        onChange={(e) => changePassword(e.target.value)}
                        required
                      />
                      <div className={styles.passwordBtn}>
                        <Button onClick={() => handlePassword()}>Mint</Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
        <Connect />
        {element}
      </main>
    </>
  );
};

export default SbtMintingPage;
