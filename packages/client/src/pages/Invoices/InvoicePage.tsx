import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { getAllInvoices, removeInvoices } from '../../actions/invoice.action'
import { InvoiceEntity } from '../../api/invoice.service'
import { renderPaidAtCell } from '../../components/DataGrid/CrossCell'
import { renderTooltipCell } from '../../components/DataGrid/TooltipCell'
import { UidCell } from '../../components/DataGrid/UidCell'
import FormPage from '../../components/FormPage/FormPage'
import useStore from '../../store/globalStore'
import InvoiceEditForm from './InvoiceEditForm'
import InvoiceForm from './InvoiceForm'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'username', headerName: 'Username', renderCell: renderTooltipCell },
    {
        field: 'user_id',
        headerName: 'UID',
        description: 'User ID of the owner of this invoice',
        renderCell: (params) => {
            return <UidCell uid={params.value} />
        },
    },
    { field: 'video_title', headerName: 'Video Title', width: 180, renderCell: renderTooltipCell },
    {
        field: 'video_id',
        headerName: 'VID',
        description: 'Video ID related to this invoice',
        renderCell: (params) => {
            return <UidCell uid={params.value} />
        },
    },
    { field: 'bank_id', headerName: 'Bank ID' },
    { field: 'tier', headerName: 'Tier' },
    {
        field: 'paid_at',
        headerName: 'Paid At',
        type: 'date',
        width: 120,
        renderCell: renderPaidAtCell,
    },
    {
        field: 'created_at',
        headerName: 'Created At',
        type: 'date',
        editable: false,
        width: 120,
        valueFormatter: (params) => {
            return new Date(params.value as string).toLocaleDateString()
        },
    },
]

const InvoicePage = () => {
    const invoiceData = useStore((state) => state.invoices)

    useEffect(() => {
        getAllInvoices()
    }, [])

    return (
        <FormPage<InvoiceEntity>
            title={'Manage invoices'}
            subtitle={
                'Invoices involving removed users or videos cannot be edited, but can be deleted.'
            }
            renderFormComponent={(formProps) => <InvoiceForm {...formProps} />}
            renderEditFormComponent={(formProps) => {
                return <InvoiceEditForm {...formProps} />
            }}
            getDisabledRows={(row) => row.user_id === null}
            dataGridProps={{
                columns,
                rows: invoiceData,
            }}
            buttonProps={{
                dialogButtonLabel: 'Create invoice',
            }}
            onDelete={removeInvoices}
        />
    )
}

export default InvoicePage
