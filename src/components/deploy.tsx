import styles from '@/styles/components/Steps.module.css'
import { useAccount, useStarknetExecute } from '@starknet-react/core'
import { stringToFelt } from '../../utils/felt'

interface DeployProps {
    tokenURI: string
}

export default function Deploy({ tokenURI }: DeployProps) {
    const publicKey = '0x7a8'
    const { address } = useAccount()

    const deployerCallData = Object.values({
        classHash: '0x00eafb0413e759430def79539db681f8a4eb98cf4196fe457077d694c6aeeb82',
        salt: Math.round(Math.random() * 99999999),
        unique: 0,
        calldata_len: 8 + tokenURI.length,
    });

    const proxyCallData = Object.values({
        implementationHash: '0x02443fe1fbfcacf18e50b6057a9a2c7e6ec6d1e6b0d8522e122f8cd26c919338',
        selector: '1295919550572838631247819983596733806859788957403169325509326258146877103642',
        callDataLen: 5 + tokenURI.length,
    })

    const initializerCallData = Object.values({
        admin: address || 0,
        starknetIdContact: '0x783a9097b26eae0586373b2ce0ed3529ddc44069d1e0fbc4f66d42b69d6850d',
        whitelistingKey: publicKey,
        maxTimestamp: new Date((document.getElementById('date') as HTMLInputElement)?.value || 0).getTime(),
        uriBaseLen: tokenURI.length,
        
    }).concat(tokenURI.split('').map((char) => stringToFelt(char).toString()))

    const { execute } = useStarknetExecute({
        calls: [
            {
                contractAddress: '0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf',
                entrypoint: 'deployContract',
                calldata: deployerCallData.concat(proxyCallData).concat(initializerCallData)
            }
        ]
    })

    const handleDeploy = () => {
        execute()
    }

    return <>
        <h2 className={styles.title}>Deploy</h2>
        <div className={styles.list}>
            <div className={styles.line}>
                <p>Admin</p>
                <div className={styles.inputContainer}>
                    <input className={styles.input} type="text" defaultValue={address} />
                </div>
            </div>
            <div className={styles.line}>
                <p>Poap password</p>
                <div className={styles.inputContainer}>
                    <input className={styles.input} type="password" />
                </div>
            </div>
            <div className={styles.line}>
                <p>Max mint date</p>
                <div className={styles.inputContainer}>
                    <input className={styles.input} id="date" type="date" defaultValue={new Date(Date.now() + 1000 * 3600 * 24 * 30 * 6).toISOString().split('T')[0]} />
                </div>
            </div>
        </div>
        <button onClick={handleDeploy} className={styles.nextButton}>
            deploy
        </button>
    </>
}