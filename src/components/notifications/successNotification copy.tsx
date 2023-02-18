import { Alert } from "@mui/material";
import styles from "@/styles/components/notification.module.css";
import { FunctionComponent, ReactElement, useEffect } from "react";

type SuccessNotificationProps = {
  message: string;
  setMenu: (menu: ReactElement | null) => void;
};

const SuccessNotification: FunctionComponent<SuccessNotificationProps> = ({
  message,
  setMenu,
}) => {
  useEffect(() => {
    setTimeout(() => setMenu(null), 4000);
  }, []);

  return (
    <Alert className={styles.container} severity="success">
      {message}
    </Alert>
  );
};

export default SuccessNotification;
