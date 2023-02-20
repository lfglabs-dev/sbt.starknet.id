import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
} from "@starknet-react/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BN from "bn.js";
import { ec, hash } from "starknet";
import Button from "@/components/UI/button";
import SelectIdentity from "@/components/selectIdentity";
import Connect from "@/components/connection/connect";
import styles from "../styles/SbtGenerator.module.css";
import sbt_abi from "@/abi/starknet/sbt_abi.json";
import { TextField } from "@mui/material";
import SbtNetworkSelector from "@/components/connection/sbtNetworkSelector";

type MetadataProps = {
  name: string;
  desc: string;
  image: string;
};

type CallDataProps = {
  calldata: (string | number)[];
  contractAddress: string;
  entrypoint: string;
};

const SbtGenerator: NextPage = () => {
  const router = useRouter();
  const { SbtAddress, network } = router.query;

  const { account, address } = useAccount();
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<BN>();
  const [tokenId, setTokenId] = useState<string>("0");
  const [password, setPassword] = useState<string>("");
  const [sbtData, setSbtData] = useState<MetadataProps>();
  const [callData, setCallData] = useState<CallDataProps[]>();

  const { execute } = useStarknetExecute({
    calls: callData,
  });
  const { contract } = useContract({
    address: contractAddress,
    abi: sbt_abi,
  });
  const { data, loading, error, refresh } = useStarknetCall({
    contract,
    method: "get_uri",
    args: [1],
    options: {
      watch: false,
    },
  });

  useEffect(() => {
    if (network === "testnet") {
      setIsMainnet(false);
    }
    setContractAddress(SbtAddress as string);
  }, [SbtAddress, network]);

  // Fetch info from contract
  useEffect(() => {
    if (!sbtData && data) {
      let dataUri = "";
      data[0].forEach((c: number) => {
        dataUri += String.fromCharCode(c);
      });
      const metadataUri = dataUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      fetch(metadataUri)
        .then((response) => response.json())
        .then((metadata) => {
          setSbtData(metadata);
        });
    }
  });

  useEffect(() => {
    if (account && callData && callData.length > 0) execute();
  }, [callData]);

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
              contractAddress: isMainnet
                ? (process.env
                    .NEXT_PUBLIC_STARKNETID_CONTRACT_MAINNET as string)
                : (process.env
                    .NEXT_PUBLIC_STARKNETID_CONTRACT_TESTNET as string),
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
      contractAddress: isMainnet
        ? (process.env.NEXT_PUBLIC_STARKNETID_CONTRACT_MAINNET as string)
        : (process.env.NEXT_PUBLIC_STARKNETID_CONTRACT_TESTNET as string),
      entrypoint: "equip",
      calldata: [contractAddress, sbt_id.toString()],
    });
    setCallData(calls);
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
              <>
                <h1 className={styles.title}>It's almost done</h1>
                <div className={styles.identitySection}>
                  <SelectIdentity
                    tokenId={tokenId}
                    changeTokenId={changeTokenId}
                  />
                  <Button onClick={updateCallData}>Mint my token</Button>
                </div>
              </>
            ) : (
              <>
                <h1 className={styles.title}>
                  {sbtData ? sbtData?.name : "Fetching SBT data..."}
                </h1>
                <p className={styles.text}>
                  {sbtData
                    ? sbtData?.desc
                    : "With Account Abstraction, SBTs on Starknet are broken. It's the reason why the starknet.id team created the Identity Token, a new standard for SBTs on Starknet. Be part of this first experience on Starknet and mint your identity token for the hacker house now !"}{" "}
                  <a
                    href="https://github.com/starknet-id/identity_tokens#readme"
                    className="underline cursor-pointer"
                  >
                    (Here is how it works)
                  </a>
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
        {!address ? <Connect /> : <SbtNetworkSelector isMainnet={isMainnet} />}
      </main>
    </>
  );
};

export default SbtGenerator;
