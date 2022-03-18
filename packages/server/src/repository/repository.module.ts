import { Global, Module } from '@nestjs/common'
import { mysqlDb } from './mysql'
import { MYSQL } from './repository.provider'

@Global()
@Module({
    providers: [
        {
            provide: MYSQL,
            useValue: mysqlDb,
        },
    ],
    exports: [MYSQL],
})
export class MySqlModule {}
