import { Alert } from '@mui/material'
import styles from '@/styles/components/Notification.module.css'
import { ReactElement, useEffect } from 'react'

interface WarningNotificationProps {
    message: string,
    setMenu: (menu: ReactElement | null) => void
}

export default function WarningNotification({ message, setMenu }: WarningNotificationProps) {
    useEffect(() => {
        setTimeout(() => setMenu(null), 4000)
    }, [])

    return <Alert className={styles.container} severity="warning">{message}</Alert>
}