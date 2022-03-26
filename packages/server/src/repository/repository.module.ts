import { Global, Module } from '@nestjs/common'
import { mysqlDb } from './mysql'
import { DbService, MYSQL } from './repository.provider'

@Global()
@Module({
    providers: [
        {
            provide: MYSQL,
            useValue: mysqlDb,
        },
        DbService,
    ],
    exports: [MYSQL, DbService],
})
export class MySqlModule {}
