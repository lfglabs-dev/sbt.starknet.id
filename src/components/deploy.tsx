import styles from "@/styles/components/Steps.module.css"
import TextField from "./UI/textField"
import { useAccount, useStarknetExecute, useTransaction } from "@starknet-react/core"
import BN from "bn.js"
import { ReactElement, useEffect, useState } from "react"
import { ec } from "starknet"
import { stringToFelt } from "../../utils/felt"
import Button from "./UI/button"
import LoadingScreen from "./UI/screens/loadingScreen"
import ErrorNotification from "./notifications/errorNotification"
import SuccessNotification from "./notifications/successNotification copy"

interface DeployProps {
    tokenURI: string
    setMenu: (element: ReactElement | null) => void
}

export default function Deploy({ tokenURI, setMenu }: DeployProps) {
    const [publicKey, setPublicKey] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [element, setElement] = useState<ReactElement | null>(null)
    const [loadingMessage, setLoadingMessage] = useState<string>("")
    const [transactionHash, setTransactionHash] = useState<string>("")
    const { data, loading, error } = useTransaction({ hash: transactionHash })
    const { address } = useAccount()

    useEffect(() => {
        if (!data) return;
        const status = (data as any).status
        setLoadingMessage(status)
        if (status === "ACCEPTED_ON_L2" || status === "ACCEPTED_ON_L1") {
            setLoadingMessage("")
            setElement(<SuccessNotification setMenu={setElement} message={"Poap contract deployed successfully"} />)
        }
    }, [data, loading, error])

    useEffect(() => {
        if (!loadingMessage) return;
        setElement(<LoadingScreen message={loadingMessage} />)
    }, [loadingMessage])

    useEffect(() => {
        const textAsBuffer = new TextEncoder().encode(password.toLowerCase());
        window.crypto.subtle.digest(
            "SHA-256",
            textAsBuffer
        ).then(hashBuffer => {
            const privateKey = new BN(new Uint8Array(hashBuffer)).mod(
                new BN(
                "3618502788666131213697322783095070105526743751716087489154079457884512865583"
                )
            );
            const keypair = ec.getKeyPair(privateKey as BN);
            setPublicKey(ec.getStarkKey(keypair))
        })
    }, [password])

    const deployerCallData = Object.values({
        classHash: "0x00eafb0413e759430def79539db681f8a4eb98cf4196fe457077d694c6aeeb82",
        salt: Math.round(Math.random() * 99999999),
        unique: 0,
        calldata_len: 8 + tokenURI.length,
    });

    const proxyCallData = Object.values({
        implementationHash: "0x02443fe1fbfcacf18e50b6057a9a2c7e6ec6d1e6b0d8522e122f8cd26c919338",
        selector: "1295919550572838631247819983596733806859788957403169325509326258146877103642",
        callDataLen: 5 + tokenURI.length,
    })

    const initializerCallData = Object.values({
        admin: address || 0,
        starknetIdContact: "0x783a9097b26eae0586373b2ce0ed3529ddc44069d1e0fbc4f66d42b69d6850d",
        whitelistingKey: publicKey,
        maxTimestamp: typeof window !== "undefined" ? new Date((document.getElementById("date") as HTMLInputElement)?.value || 0).getTime() : 0,
        uriBaseLen: tokenURI.length,
        
    }).concat(tokenURI.split("").map((char) => stringToFelt(char).toString()))

    const { execute } = useStarknetExecute({
        calls: [
            {
                contractAddress: "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf",
                entrypoint: "deployContract",
                calldata: deployerCallData.concat(proxyCallData).concat(initializerCallData)
            }
        ]
    })

    const handleDeploy = () => {
        if (!password) return setMenu(<ErrorNotification setMenu={setMenu} message={"Please enter a password for your poap"} />)
        execute().then((tx) => {
            setLoadingMessage((tx as any).code)
            setTransactionHash(tx.transaction_hash)
        })
    }

    return (
        <>
            <div className={styles.list}>
                <TextField className={styles.textField} label="Admin" defaultValue={address} />
                <TextField className={styles.textField} label="Poap password" onChange={(e) => setPassword(e.target.value)} />
                <div className={styles.line}>
                    <p>Max mint date</p>
                    <div className={styles.inputContainer}>
                        <input className={styles.input} id="date" type="date" defaultValue={new Date(Date.now() + 1000 * 3600 * 24 * 30 * 6).toISOString().split("T")[0]} />
                    </div>
                </div>
            </div>
            <div className={styles.nextButton}>
                <Button onClick={handleDeploy}>
                    deploy
                </Button>
            </div>
            {element}
        </>
    )
}