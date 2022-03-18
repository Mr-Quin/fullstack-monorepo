import { Module } from '@nestjs/common'
import { ApiKeyService } from '../common/api-key.service'
import { WsGateway } from './ws.gateway'

@Module({
    imports: [],
    providers: [WsGateway, ApiKeyService],
})
export class WsModule {}
