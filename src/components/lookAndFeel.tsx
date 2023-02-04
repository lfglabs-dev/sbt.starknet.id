import styles from "@/styles/components/Steps.module.css"
import { useAccount } from "@starknet-react/core"
import { ReactElement, useState } from "react"
import ErrorNotification from "./notifications/errorNotification"
import SuccessNotification from "./notifications/successNotification copy"
import Button from "./UI/button"
import Loading from "./UI/loading"
import TextField from "./UI/textField"
import buttonStyles from "@/styles/components/button.module.css"

interface LookAndFeelProps {
    [key: string]: any,
    setTokenURI: (tokenURI: string) => void
    setMenu: (menu: ReactElement | null) => void
}

export default function LookAndFeel({ setTokenURI, setMenu, ...props }: LookAndFeelProps) {
    const [name, setName] = useState<string>("")
    const [desc, setDesc] = useState<string>("")
    const [element, setElement] = useState<ReactElement | null>(null)
    const [clickedNext, setClickedNext] = useState<boolean>(false)
    const { address } = useAccount()
    
    const handleNext = async () => {
        setClickedNext(true)
        if (!address) return;
        setElement(
            <div className={styles.loadingContainer}>
                <Loading />
            </div>
        )
        const nameInput = document.getElementById("name") as HTMLInputElement;
        const name = nameInput.value;
        if (!name) return error("Please enter a name for your poap")

        const descInput = document.getElementById("description") as HTMLInputElement;
        const desc = descInput.value;
        if (!desc) return error("Please enter a description for your poap")

        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput.files?.length !== 1) return error("Please select an image")
        // Check that the file is an image
        const file = fileInput.files[0];
        if (!file.type.startsWith("image/")) return error("The selected file is not an image")

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        formData.append("desc", desc);
        const res = await fetch("/api/nft_storage", {
          method: "post",
          body: formData
        })
        const json = await res.json()
        if (!json.url) return error("Something went wrong");
        setTokenURI(json.url)
        setMenu(<SuccessNotification setMenu={setMenu} message="Image successfully uploaded" />)
        setElement(null)
    }

    function error(message: string) {
        setElement(null)
        setMenu(<ErrorNotification setMenu={setMenu} message={message} />)
    }
    
    return (
        <div {...props}>
            <div className={styles.list}>
                <TextField error={clickedNext && !name} helperText={clickedNext && !name ? 'Please enter a name' : ''} onChange={(e) => setName(e.target.value)} className={styles.textField} label="Name" id="name" />
                <TextField error={clickedNext && !desc} helperText={clickedNext && !desc ? 'Please enter a description' : ''} onChange={(e) => setDesc(e.target.value)} className={styles.textField} label="Description" id="description" />
            </div>
            <br />
            <input onChange={handleNext} className={styles.input} name="image" id="image" type="file" />
            <label htmlFor="image">Choose an image</label>
            {element}
        </div>
    )
}