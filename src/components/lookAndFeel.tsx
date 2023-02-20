import styles from "@/styles/components/steps.module.css";
import { useAccount } from "@starknet-react/core";
import { FunctionComponent, ReactElement, useState } from "react";
import ErrorNotification from "./notifications/errorNotification";
import SuccessNotification from "./notifications/successNotification copy";
import WarningNotification from "./notifications/warningNotification";
import Loading from "./UI/loading";
import TextField from "./UI/textField";

type LookAndFeelProps = {
  setTokenURI: (tokenURI: string) => void;
  setMenu: (menu: ReactElement | null) => void;
};

const LookAndFeel: FunctionComponent<LookAndFeelProps> = ({
  setTokenURI,
  setMenu,
  ...props
}) => {
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [element, setElement] = useState<ReactElement | null>(null);
  const [clickedNext, setClickedNext] = useState<boolean>(false);
  const { address } = useAccount();

  const handleNext = async () => {
    setClickedNext(true);
    if (!address) return;
    setElement(
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const name = nameInput.value;
    if (!name) return error("Please enter a name for your poap");

    const descInput = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const desc = descInput.value;
    if (!desc) return error("Please enter a description for your poap");

    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput.files?.length !== 1) return error("Please select an image");
    // Check that the file is an image
    const file = fileInput.files[0];
    if (!file.type.startsWith("image/"))
      return error("The selected file is not an image");
    const img = new Image();
    const _URL = window.URL || window.webkitURL;
    var objectUrl = _URL.createObjectURL(file);
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      // Check that the image is 2:3
      console.log(width, height, width * 1.5);
      if (height !== width * 1.5)
        setMenu(
          <WarningNotification
            setMenu={setMenu}
            message="It is recommended to have a 2:3 image"
          />
        );
      _URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("desc", desc);
    const res = await fetch("/api/nft_storage", {
      method: "post",
      body: formData,
    });
    const json = await res.json();
    if (!json.url) return error("Something went wrong");
    setTokenURI(json.url + "?tokenId=");
    setMenu(
      <SuccessNotification
        setMenu={setMenu}
        message="Image successfully uploaded"
      />
    );
    setElement(null);
  };

  function error(message: string) {
    setElement(null);
    setMenu(<ErrorNotification setMenu={setMenu} message={message} />);
  }

  return (
    <div {...props}>
      <div className={styles.list}>
        <TextField
          error={clickedNext && !name}
          helperText={clickedNext && !name ? "Please enter a name" : ""}
          onChange={(e) => setName(e.target.value)}
          label="Name"
          id="name"
        />
        <br />
        <TextField
          error={clickedNext && !desc}
          helperText={clickedNext && !desc ? "Please enter a description" : ""}
          onChange={(e) => setDesc(e.target.value)}
          label="Description"
          id="description"
        />
      </div>
      <br />
      <input
        onChange={handleNext}
        className={styles.input}
        name="image"
        id="image"
        type="file"
      />
      <label htmlFor="image">Choose an image</label>
      {element}
    </div>
  );
};

export default LookAndFeel;
