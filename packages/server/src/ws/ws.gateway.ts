import {
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'ws'
import { ApiKeyService } from '../common/api-key.service'

@WebSocketGateway()
export class WsGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server

    constructor(private readonly apiKeyService: ApiKeyService) {}

    get clients() {
        return this.server.clients
    }

    notifyEachClient(data: any) {
        this.clients.forEach((client) => {
            client.send(JSON.stringify(data))
        })
    }

    afterInit(server: Server) {
        server.on('connection', (ws, req) => {
            // close connection if no api key is provided
            if (!this.apiKeyService.validateQueryString(req.url)) {
                ws.close()
            }
            this.notifyEachClient(this.clients.size)
            ws.on('close', () => {
                this.notifyEachClient(this.clients.size)
            })
        })
    }

    @SubscribeMessage('message')
    handleEvent(client: any, data: unknown) {
        // console.log(`Message received: ${data}`)
    }
}
