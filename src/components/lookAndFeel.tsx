import styles from '@/styles/components/Steps.module.css'

interface LookAndFeelProps {
    [key: string]: any,
    setTokenURI: (tokenURI: string) => void
}

export default function LookAndFeel({ setTokenURI, ...props }: LookAndFeelProps) {
    const handleNext = () => {
        // TODO
        setTokenURI('abc')
    }

    return <div {...props}>
        <h2 className={styles.title}>Look and feel</h2>
        <div className={styles.list}>
            <div className={styles.line}>
                <p>Name</p>
                <div className={styles.inputContainer}>
                    <input type="text" />
                </div>
            </div>
            <div className={styles.line}>
                <p>Description</p>
                <div className={styles.inputContainer}>
                    <input type="text" />
                </div>
            </div>
            <div className={styles.line}>
                <p>Image</p>
                <div className={styles.inputContainer}>
                    <input name='file' id="file" type="file" />
                    <label htmlFor="file">Choose a file</label>
                </div>
            </div>
        </div>
        <button onClick={handleNext} className={styles.nextButton}>
            next
        </button>
    </div>
}