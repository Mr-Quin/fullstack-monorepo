import { Box, BoxProps } from '@mui/material'
import type { DataGridProps } from '@mui/x-data-grid'
import CustomToolBar from './CustomToolBar'
import StyledDataGrid from './StyledDataGrid'

type CustomDataGridComponents = Omit<DataGridProps['components'], 'Toolbar'>

type CustomDataGridProps = {
    height?: number
    containerProps?: BoxProps
} & Omit<
    DataGridProps,
    'editMode' | 'checkboxSelection' | 'disableSelectionOnClick' | 'components'
> & {
        components?: CustomDataGridComponents
    }

const CustomDataGrid = (props: CustomDataGridProps) => {
    const { height, containerProps, ...gridProps } = props

    return (
        <Box sx={{ height: height ?? 600, mb: 2 }} {...containerProps}>
            <StyledDataGrid
                editMode={'row'}
                checkboxSelection
                disableSelectionOnClick
                components={{
                    Toolbar: CustomToolBar,
                }}
                {...gridProps}
            />
        </Box>
    )
}

export default CustomDataGrid
