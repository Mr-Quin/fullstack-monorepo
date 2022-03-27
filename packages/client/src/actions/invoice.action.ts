import { fetchApi } from '../api/fetchApi'
import { CreateInvoiceDto, UpdateInvoiceDto } from '../api/invoice.service'
import useStore, { setSnackbar } from '../store/globalStore'

export const getAllInvoices = async () => {
    useStore.setState({ isLoading: true })
    const res = await fetchApi('/invoices')
    useStore.setState({ isLoading: false })

    const invoices = res.data.map((invoice) => {
        return {
            ...invoice,
            id: invoice.invoice_id,
        }
    })
    useStore.setState({ invoices })

    return invoices
}

export const createInvoice = async (data: CreateInvoiceDto) => {
    const res = await fetchApi('/invoices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (res.error) {
        throw new Error(res.message)
    }

    setSnackbar({
        message: `Created invoice id ${res.data.insertId}`,
        type: 'success',
    })

    return getAllInvoices()
}

export const updateInvoice = async (id: NumberOrString, data: UpdateInvoiceDto) => {
    const res = await fetchApi(`/invoices/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (res.error) throw new Error(res.message)

    setSnackbar({
        message: `Updated invoice id ${id}`,
        type: 'success',
    })

    return getAllInvoices()
}

export const removeInvoices = async (id: NumberOrString[]) => {
    const res = await fetchApi(`/invoices`, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            invoice_ids: id,
        }),
        method: 'DELETE',
    })

    if (res.error) {
        throw new Error(res.message)
    }

    if (res.data.rowCount === 0) {
        setSnackbar({
            message: `Invoice already deleted`,
            type: 'error',
        })
    } else {
        setSnackbar({
            message: `Deleted ${res.data.rowCount} ${
                res.data.rowCount === 1 ? 'invoice' : 'invoices'
            }`,
            type: 'success',
        })
    }
    return getAllInvoices()
}
