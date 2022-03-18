import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import shallow from 'zustand/shallow'
import { getAllBanks, removeBanks } from '../../actions/bank.action'
import { BankEntity } from '../../api/bank.service'
import { renderAccountTypeCell } from '../../components/DataGrid/AccountTypeCell'
import { UidCell } from '../../components/DataGrid/UidCell'
import FormPage from '../../components/FormPage/FormPage'
import useStore from '../../store/globalStore'
import BankForm from './BankForm'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
        field: 'user_id',
        headerName: 'UID',
        description: 'User ID of the owner of this account',
        renderCell: (params) => {
            return <UidCell uid={params.value} />
        },
    },
    {
        field: 'nickname',
        headerName: 'Account Nickname',
        description: 'Account nickname',
        width: 150,
    },
    {
        field: 'bank_name',
        headerName: 'Bank Name',
        description: 'Name of the bank',
        width: 150,
    },
    { field: 'account_number', headerName: 'Account Number', width: 150 },
    { field: 'routing_number', headerName: 'Routing Number', width: 150 },
    {
        field: 'type',
        headerName: 'Account Type',
        width: 150,
        renderCell: renderAccountTypeCell,
    },
    {
        field: 'created_at',
        headerName: 'Created At',
        width: 120,
        valueFormatter: (params) => {
            return new Date(params.value as string).toLocaleDateString()
        },
    },
]

const BankPage = () => {
    const bankData = useStore((state) => state.banks, shallow)

    useEffect(() => {
        getAllBanks()
    }, [])

    return (
        <FormPage<BankEntity>
            title={'Manage user bank accounts'}
            subtitle={'Bank accounts owned by removed users cannot be edited, but can be deleted.'}
            renderFormComponent={(formProps) => <BankForm {...formProps} type={'create'} />}
            renderEditFormComponent={(formProps) => <BankForm {...formProps} type={'update'} />}
            dataGridProps={{
                columns,
                rows: bankData,
            }}
            getDisabledRows={(row) => row.user_id === null}
            buttonProps={{
                dialogButtonLabel: 'Add bank account',
            }}
            onDelete={removeBanks}
        />
    )
}

export default BankPage
