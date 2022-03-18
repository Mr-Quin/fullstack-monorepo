import { Close } from '@mui/icons-material'
import { Box } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'

export const CrossCell = () => {
    return (
        <Box display={'flex'} width={'100%'} justifyContent={'center'}>
            <Close />
        </Box>
    )
}

export const renderPaidAtCell = (params: GridRenderCellParams) => {
    if (params.value === null) return <CrossCell />
    return new Date(params.value).toLocaleDateString()
}
