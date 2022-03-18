import { useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import useStore, { GlobalState } from '../store/globalStore'

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const socketUrl =
    process.env.NODE_ENV === 'development'
        ? `${protocol}//localhost:3000`
        : `${protocol}//${window.location.host}`

const selector = (state: GlobalState) => [state.updateConnection, state.apiKey] as const

enum WsEvent {
    Message = 'message',
}

const Ws = () => {
    const [updateConnection, apiKey] = useStore(selector)

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
        reconnectAttempts: 5,
        queryParams: {
            'api-key': apiKey,
        },
    })

    useEffect(() => {
        if (lastMessage?.data && !Number.isNaN(Number(lastMessage.data))) {
            updateConnection({
                isConnected: true,
                numConnected: Number(lastMessage.data),
            })
        }
    }, [lastMessage])

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
                event: WsEvent.Message,
                data: 1,
            })
        } else if (readyState === ReadyState.CLOSED) {
            updateConnection({
                isConnected: false,
                numConnected: 0,
            })
        }
    }, [readyState])

    return null
}

export default Ws
