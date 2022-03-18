import { Chip, ChipProps } from '@mui/material'
import { GridRenderEditCellParams } from '@mui/x-data-grid'

type AccountTypeCellProps = {
    accountType: 'savings' | 'checking'
} & ChipProps

const titleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const savingsColor = '#0e7c25'
const checkingColor = '#105288'

const AccountTypeCell = (props: AccountTypeCellProps) => {
    const bgcolor = props.accountType === 'savings' ? savingsColor : checkingColor
    return <Chip sx={{ bgcolor, borderRadius: 1 }} label={titleCase(props.accountType)} />
}

export const renderAccountTypeCell = (params: GridRenderEditCellParams) => {
    return (
        <AccountTypeCell
            accountType={params.value as any}
            onDelete={() => {
                return
            }}
        />
    )
}

export default AccountTypeCell
