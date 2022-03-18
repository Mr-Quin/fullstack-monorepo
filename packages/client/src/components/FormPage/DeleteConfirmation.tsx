import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'

export type DeleteConfirmationProps = {
    open: boolean
    onClose: () => void
    onDelete: () => void
    count?: number
}

const DeleteConfirmation = ({ open, onDelete, onClose, count = 1 }: DeleteConfirmationProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{'Delete'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`Are you sure to delete  ${count} ${count === 1 ? 'item' : 'items'}?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant={'outlined'}>
                    Cancel
                </Button>
                <Button
                    onClick={onDelete}
                    color={'error'}
                    sx={{ bgcolor: 'error.dark' }}
                    variant={'contained'}
                >
                    {'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmation
