import { Alert } from "@mui/material";
import styles from "@/styles/components/notification.module.css";
import React, { FunctionComponent, ReactElement, useEffect } from "react";

type WarningNotificationProps = {
  message: string;
  setMenu: (menu: ReactElement | null) => void;
};

const WarningNotification: FunctionComponent<WarningNotificationProps> = ({
  message,
  setMenu,
}) => {
  useEffect(() => {
    setTimeout(() => setMenu(null), 4000);
  }, []);

  return (
    <Alert className={styles.container} severity="warning">
      {message}
    </Alert>
  );
};

export default WarningNotification;
