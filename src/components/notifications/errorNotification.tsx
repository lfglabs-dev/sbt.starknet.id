import { Alert } from "@mui/material";
import styles from "@/styles/components/notification.module.css";
import { FunctionComponent, ReactElement, useEffect } from "react";

type ErrorNotificationProps = {
  message: string;
  setMenu: (menu: ReactElement | null) => void;
};

const ErrorNotification: FunctionComponent<ErrorNotificationProps> = ({
  message,
  setMenu,
}) => {
  useEffect(() => {
    setTimeout(() => setMenu(null), 4000);
  }, []);

  return (
    <Alert className={styles.container} severity="error">
      {message}
    </Alert>
  );
};

export default ErrorNotification;
