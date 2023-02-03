import styles from '@/styles/components/Steps.module.css'
import { useAccount } from '@starknet-react/core'
import { ReactElement } from 'react'
import ErrorNotification from './notifications/errorNotification'
import SuccessNotification from './notifications/successNotification copy'

interface LookAndFeelProps {
    [key: string]: any,
    setTokenURI: (tokenURI: string) => void
    setMenu: (menu: ReactElement | null) => void
}

export default function LookAndFeel({ setTokenURI, setMenu, ...props }: LookAndFeelProps) {
    const { address } = useAccount()
    
    const handleNext = async () => {
        if (!address) return;
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput.files?.length !== 1) return setMenu(<ErrorNotification setMenu={setMenu} message="Please select an image" />)
        // Check that the file is an image
        const file = fileInput.files[0];
        if (!file.type.startsWith('image/')) return setMenu(<ErrorNotification setMenu={setMenu} message="The selected file is not an image" />)

        const nameInput = document.getElementById('name') as HTMLInputElement;
        const name = nameInput.value;
        if (!name) return setMenu(<ErrorNotification setMenu={setMenu} message="Please enter a name" />)

        const descInput = document.getElementById('description') as HTMLInputElement;
        const desc = descInput.value;
        if (!desc) return setMenu(<ErrorNotification setMenu={setMenu} message="Please enter a description" />)

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        formData.append("desc", desc);
        const res = await fetch('/api/nft_storage', {
          method: 'post',
          body: formData
        })
        const json = await res.json()
        if (!json.url) return setMenu(<ErrorNotification setMenu={setMenu} message="Something went wrong" />);
        setTokenURI(json.url)
        setMenu(<SuccessNotification setMenu={setMenu} message="Image successfully uploaded" />)
    }

    return <div {...props}>
        <h2 className={styles.title}>Look and feel</h2>
        <div className={styles.list}>
            <div className={styles.line}>
                <p>Name</p>
                <div className={styles.inputContainer}>
                    <input id="name" className={styles.input} type="text" />
                </div>
            </div>
            <div className={styles.line}>
                <p>Description</p>
                <div className={styles.inputContainer}>
                    <input id="description" className={styles.input} type="text" />
                </div>
            </div>
            <div className={styles.line}>
                <p>Image</p>
                <div className={styles.inputContainer}>
                    <input className={styles.input} name='image' id="image" type="file" />
                    <label htmlFor="image">Choose a file</label>
                </div>
            </div>
        </div>
        <button onClick={handleNext} className={styles.nextButton}>
            next
        </button>
    </div>
}