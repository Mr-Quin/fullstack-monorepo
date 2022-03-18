import { Alert, Snackbar } from '@mui/material'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import useStore, { GlobalState } from '../store/globalStore'

const selector = (state: GlobalState) => state.snackbar

const GlobalSnackbar = () => {
    const [open, setOpen] = useState(false)
    const { type, message, key } = useStore(selector)

    useEffect(() => {
        setOpen(message !== '')
    }, [key])

    const handleClose = useCallback((event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }, [])

    const handleExisted = useCallback(() => {
        setOpen(false)
    }, [])

    return (
        <Snackbar
            key={key}
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExisted }}
        >
            <Alert severity={type} onClose={handleClose}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default GlobalSnackbar
