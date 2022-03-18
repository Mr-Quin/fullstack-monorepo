// wrap fetch with api header
import useStore from '../store/globalStore'

export const fetchApi = async (input: RequestInfo, initParam?: RequestInit) => {
    const init = initParam ?? {}

    // this api key is exposed
    init.headers = { ...init?.headers, 'api-key': useStore.getState().apiKey }

    try {
        const res = await fetch(`/api${input}`, init)
        if (res.json) {
            return res.json()
        }
        return { error: 'could not connect to server', message: 'could not connect to server' }
    } catch (err: any) {
        return { error: err.message, message: err.message }
    }
}
