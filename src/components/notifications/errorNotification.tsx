import { Alert } from '@mui/material'
import styles from '@/styles/components/Notification.module.css'
import { ReactElement, useEffect } from 'react'

interface ErrorNotificationProps {
    message: string,
    setMenu: (menu: ReactElement | null) => void
}

export default function ErrorNotification({ message, setMenu }: ErrorNotificationProps) {
    useEffect(() => {
        setTimeout(() => setMenu(null), 4000)
    }, [])

    return <Alert className={styles.container} severity="error">{message}</Alert>
}