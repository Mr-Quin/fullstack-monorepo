import { Box, Button, Dialog, DialogProps, Grid, Typography } from '@mui/material'
import { DataGridProps, GridRowModel, GridRowParams, GridSelectionModel } from '@mui/x-data-grid'
import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import useStore, { GlobalState } from '../../store/globalStore'
import CustomDataGrid from '../DataGrid/CustomDataGrid'
import DeleteConfirmation from './DeleteConfirmation'

export type FormProps = {
    onClose: () => void
}

export type EditFormProps<DataType extends GridRowModel = GridRowModel> = FormProps & {
    onClose: () => void
    initValue?: DataType
    id?: string | number
}

type PageProps<DataType = GridRowModel> = {
    title?: string
    subtitle?: string
    dialogProps?: DialogProps
    dataGridProps: DataGridProps
    renderFormComponent: (formProps: FormProps) => ReactElement<any>
    renderEditFormComponent: (formProps: EditFormProps<DataType>) => ReactElement<any>
    onDelete: (selection: GridSelectionModel) => Promise<void>
    getDisabledRows?: (selection: DataType) => boolean
    buttonProps: {
        dialogButtonLabel?: string
        deleteButtonLabel?: string
    }
}

const selector = (state: GlobalState) => state.isLoading

type FormState = {
    initValue?: any
    id?: string | number
    open: boolean
    type: 'create' | 'update'
}

const formInitState: FormState = {
    open: false,
    type: 'create',
    initValue: undefined,
    id: undefined,
}

const FormPage = <DataType extends GridRowModel>(props: PageProps<DataType>) => {
    const {
        title,
        subtitle,
        renderFormComponent,
        renderEditFormComponent,
        dialogProps,
        dataGridProps,
        buttonProps,
        getDisabledRows,
        onDelete,
    } = props

    const [gridSelection, setGridSelection] = useState<GridSelectionModel>([])
    const [{ open: formOpen, ...formProps }, setFormState] = useState<FormState>(formInitState)
    const [confirmationOpen, setConfirmationOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const isDataLoading = useStore(selector)

    const handleDelete = useCallback(async () => {
        setIsLoading(true)
        setConfirmationOpen(false)
        try {
            await onDelete(gridSelection)
        } finally {
            setIsLoading(false)
        }
    }, [onDelete, gridSelection])

    const handleGridSelection = useCallback((selectionModel: GridSelectionModel) => {
        setGridSelection(selectionModel)
    }, [])

    const handleFormClose = useCallback(() => {
        setFormState((prevState) => ({ ...prevState, open: false }))
    }, [])

    const handleCreateFormOpen = useCallback(() => {
        setFormState({
            ...formInitState,
            open: true,
        })
    }, [])

    const handleEditFormOpen = useCallback((params: GridRowParams) => {
        if (getDisabledRows?.(params.row as DataType)) return
        setFormState({
            ...formProps,
            initValue: params?.row as any,
            type: 'edit' as any,
            id: params?.row?.id,
            open: true,
        })
    }, [])

    return (
        <>
            {title && (
                <Box sx={{ pb: 1, mb: 3 }}>
                    <Typography component={'h2'} variant={'h5'}>
                        {title}
                    </Typography>
                </Box>
            )}
            {subtitle && (
                <Typography component={'h3'} variant={'body1'}>
                    {subtitle}
                </Typography>
            )}
            {/*Form dialog*/}
            <Dialog
                fullWidth
                open={formOpen}
                maxWidth={'md'}
                onClose={handleFormClose}
                {...dialogProps}
            >
                {formProps.type === 'create'
                    ? renderFormComponent({
                          onClose: handleFormClose,
                      })
                    : renderEditFormComponent({
                          ...formProps,
                          id: formProps.id!,
                          onClose: handleFormClose,
                      })}
            </Dialog>
            <DeleteConfirmation
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
                onDelete={handleDelete}
                count={gridSelection.length}
            />
            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent={'center'}>
                <Grid item xs={12}>
                    <CustomDataGrid
                        {...dataGridProps}
                        selectionModel={gridSelection}
                        onRowDoubleClick={handleEditFormOpen}
                        onSelectionModelChange={handleGridSelection}
                        loading={isLoading || isDataLoading}
                        getRowClassName={({ row }) => {
                            if (!getDisabledRows) return ''
                            return getDisabledRows(row as DataType) ? 'Row-disabled' : ''
                        }}
                    />
                    <Button
                        color={'error'}
                        sx={{ bgcolor: 'error.dark' }}
                        variant={'contained'}
                        disabled={gridSelection.length === 0 || isLoading}
                        onClick={() => setConfirmationOpen(true)}
                    >
                        {buttonProps.deleteButtonLabel ?? 'Delete selected'}
                    </Button>
                    <Button
                        sx={{
                            color: 'text.primary',
                            backgroundColor: 'primary.dark',
                            ml: 2,
                        }}
                        variant={'contained'}
                        disabled={isLoading}
                        onClick={handleCreateFormOpen}
                    >
                        {buttonProps.dialogButtonLabel ?? 'Open Form'}
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default FormPage
