import { darken, styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    // border: 0,
    color: darken(theme.palette.text.primary, 0.05),
    '& .Row-disabled': {
        backgroundColor: darken(theme.palette.background.default, 0.1),

        '& .MuiDataGrid-cell': {
            color: theme.palette.text.disabled,
        },
        '& .MuiDataGrid-cell:not(.MuiDataGrid-cellCheckbox) > *': {
            color: theme.palette.text.disabled,
        },

        ':hover': {
            backgroundColor: darken(theme.palette.background.default, 0.1),
        },
    },
    '& .MuiDataGrid-row--lastVisible': {
        '& .MuiDataGrid-cell': {
            borderColor: '#4f4f4f !important', // TODO: possible bug in mui-datagrid
        },
    },
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: '#6e6e6e',
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeaders': {
        borderBottom: `1px solid #8e8e8e`,
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `1px solid #4f4f4f`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid #4f4f4f`,
    },
    '& .MuiDataGrid-cell': {
        color: darken(theme.palette.text.primary, 0.15),
        '&:last-child': {
            borderRight: 0,
        },
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
    '& .MuiDataGrid-cell--uneditable': {
        color: theme.palette.text.disabled,
        backgroundColor: darken(theme.palette.background.default, 0.1),
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
    },
}))

export default StyledDataGrid
