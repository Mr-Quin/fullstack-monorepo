import { Box, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'

export type TooltipCellProps = {
    value: string
}

const TooltipCell = ({ value }: TooltipCellProps) => {
    return (
        <Tooltip title={value} placement={'top-start'}>
            <Box overflow={'hidden'} textOverflow={'ellipsis'} component={'span'}>
                {value}
            </Box>
        </Tooltip>
    )
}

export const renderTooltipCell = (props: GridRenderCellParams) => {
    return <TooltipCell value={props.value} />
}

export default TooltipCell
