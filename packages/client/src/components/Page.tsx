import { Box, Button, ButtonProps, Dialog, DialogProps, Grid, Typography } from '@mui/material'
import type { MouseEvent, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { cloneElement, useCallback, useState } from 'react'

type PageProps = PropsWithChildren<{
    title?: string
    dialogContent?: ReactElement<any>
    dialogProps?: DialogProps
    dataGrid?: ReactNode
    openButtonLabel?: string
    deleteButtonProps?: ButtonProps
}>

const Page = (props: PageProps) => {
    const { title, dialogContent, dialogProps, dataGrid, deleteButtonProps, children } = props
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDelete = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            deleteButtonProps?.onClick?.(e)
        },
        [deleteButtonProps?.onClick]
    )

    return (
        <>
            {props.title && (
                <Box sx={{ pb: 1, mb: 3 }}>
                    <Typography component={'h2'} variant={'h5'}>
                        {title}
                    </Typography>
                </Box>
            )}
            {dialogContent && (
                <Dialog
                    fullWidth
                    open={dialogOpen}
                    maxWidth={'md'}
                    onClose={() => setDialogOpen(false)}
                    {...dialogProps}
                >
                    {cloneElement(dialogContent, {
                        onClose: () => setDialogOpen(false),
                    })}
                </Dialog>
            )}
            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent={'center'}>
                {dataGrid && (
                    <Grid item xs={12}>
                        {dataGrid}
                        <Button
                            color={'error'}
                            variant={'contained'}
                            {...deleteButtonProps}
                            onClick={handleDelete}
                        >
                            Delete selected
                        </Button>
                        {dialogContent && (
                            <Button
                                sx={{
                                    color: 'text.primary',
                                    backgroundColor: 'primary.dark',
                                    ml: 2,
                                }}
                                variant={'contained'}
                                onClick={() => {
                                    setDialogOpen(true)
                                }}
                            >
                                {props.openButtonLabel ?? 'Open Form'}
                            </Button>
                        )}
                    </Grid>
                )}
                {children}
            </Grid>
        </>
    )
}

export default Page
