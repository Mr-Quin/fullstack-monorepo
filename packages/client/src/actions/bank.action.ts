import { CreateBankDto, UpdateBankDto } from '../api/bank.service'
import { fetchApi } from '../api/fetchApi'
import useStore, { setSnackbar } from '../store/globalStore'

export const getAllBanks = async () => {
    useStore.setState({ isLoading: true })
    const res = await fetchApi('/banks')
    useStore.setState({ isLoading: false })

    if (res.error) {
        throw new Error(res.message)
    }

    const banks = res.data.map((bank) => {
        return {
            ...bank,
            id: bank.bank_id,
        }
    })

    useStore.setState({ banks })

    return banks
}

export const createBank = async (data: CreateBankDto) => {
    const res = await fetchApi('/banks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (res.error) throw new Error(res.message)

    setSnackbar({
        message: `Created bank account id ${res.data.insertId}`,
        type: 'success',
    })

    return getAllBanks()
}

export const updateBank = async (id: NumberOrString, data: UpdateBankDto) => {
    const res = await fetchApi(`/banks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (res.error) throw new Error(res.message)

    setSnackbar({
        message: `Updated bank account id ${id}`,
        type: 'success',
    })

    return getAllBanks()
}

export const removeBanks = async (id: NumberOrString[]) => {
    const res = await fetchApi(`/banks`, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bank_ids: id,
        }),
        method: 'DELETE',
    })

    if (res.error) {
        throw new Error(res.message)
    }

    if (res.data.rowCount === 0) {
        setSnackbar({
            message: `Bank already deleted`,
            type: 'error',
        })
    } else {
        setSnackbar({
            message: `Deleted ${res.data.rowCount} ${res.data.rowCount === 1 ? 'bank' : 'banks'}`,
            type: 'success',
        })
    }
    return getAllBanks()
}
