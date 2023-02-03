import { Alert } from '@mui/material'
import styles from '@/styles/components/Notification.module.css'
import { ReactElement, useEffect } from 'react'

interface SuccessNotificationProps {
    message: string,
    setMenu: (menu: ReactElement | null) => void
}

export default function SuccessNotification({ message, setMenu }: SuccessNotificationProps) {
    useEffect(() => {
        setTimeout(() => setMenu(null), 4000)
    }, [])

    return <Alert className={styles.container} severity="success">{message}</Alert>
}