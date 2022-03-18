import { useEffect } from 'react'
import { getAllBanks } from '../actions/bank.action'
import { getAllInvoices } from '../actions/invoice.action'
import { getAllUsers } from '../actions/user.action'
import { getAllVideos } from '../actions/video.action'
import useStore from '../store/globalStore'

const FetchData = () => {
    const setLoading = useStore((state) => state.setLoading)

    useEffect(() => {
        const fetchData = async () => {
            // This will update the global store
            // future state updates will be handled by the global store
            setLoading(true)
            await Promise.all([getAllInvoices(), getAllVideos(), getAllUsers(), getAllBanks()])
            setLoading(false)
        }
        fetchData().catch((err) => {
            console.error(err)
            setLoading(false)
        })
    }, [])

    return null
}

export default FetchData
