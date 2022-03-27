import { Global, Module } from '@nestjs/common'
import { DbService } from './repository.provider'

@Global()
@Module({
    providers: [DbService],
    exports: [DbService],
})
export class DbModule {}
