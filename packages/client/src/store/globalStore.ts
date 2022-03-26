import create from 'zustand'
import { BankEntity } from '../api/bank.service'
import { InvoiceEntity } from '../api/invoice.service'
import { UserEntity } from '../api/user.service'
import { VideoEntity } from '../api/video.service'

type Connection = {
    isConnected: boolean
    numConnected: number
}

type Snackbar = {
    message: string
    type: 'success' | 'error'
    key: any
}

export type GlobalState = {
    users: UserEntity[]
    banks: BankEntity[]
    videos: VideoEntity[]
    invoices: InvoiceEntity[]
    apiKey: string
    isLoading: boolean
    connection: Connection
    snackbar: Snackbar
    setSnackbar: (snackbar: Omit<Snackbar, 'key'>) => void
    setLoading: (isLoading: boolean) => void
    updateConnection: (connection: Connection) => void
}

if (process.env.REACT_APP_API_KEY === undefined) {
    throw new Error('API_KEY is not defined')
}

const useStore = create<GlobalState>((set) => ({
    users: [],
    banks: [],
    videos: [],
    invoices: [],
    apiKey: process.env.REACT_APP_API_KEY as string,
    isLoading: false,
    connection: {
        isConnected: false,
        numConnected: 0,
    },
    snackbar: {
        message: '',
        type: 'success',
        key: '',
    },
    setSnackbar: (snackbar: Omit<Snackbar, 'key'>) =>
        set((state) => {
            return {
                snackbar: {
                    ...snackbar,
                    key: new Date().getTime(),
                },
            }
        }),
    setLoading: (isLoading: boolean) => set((state) => ({ ...state, isLoading })),
    updateConnection: (connection: Connection) => set((state) => ({ ...state, connection })),
}))

export const setSnackbar = (snackbar: Omit<Snackbar, 'key'>) => {
    useStore.getState().setSnackbar(snackbar)
}

export default useStore
