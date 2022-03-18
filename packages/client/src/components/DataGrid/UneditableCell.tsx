import { Box } from '@mui/material'
import { GridRenderEditCellParams } from '@mui/x-data-grid'
import { PropsWithChildren } from 'react'

const UneditableCell = (props: PropsWithChildren<any>) => {
    return <Box className={'MuiDataGrid-cell--uneditable'}>{props.children}</Box>
}

export const renderBaseUneditableCell = (params: GridRenderEditCellParams) => {
    return <UneditableCell>{params.value}</UneditableCell>
}

export default UneditableCell
