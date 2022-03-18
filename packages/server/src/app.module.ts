import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import path from 'node:path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BanksModule } from './banks/banks.module'
import { ApiKeyService } from './common/api-key.service'
import { SqlExceptionFilter } from './common/filters/sql-exception.filter'
import { AuthenticationGuard } from './common/guards/AuthenticationGuard'
import { InvoicesModule } from './invoices/invoices.module'
import { MySqlModule } from './repository/repository.module'
import { UsersModule } from './users/users.module'
import { VideosModule } from './videos/videos.module'
import { WsModule } from './ws/ws.module'

@Module({
    imports: [
        ServeStaticModule.forRoot({
            // eslint-disable-next-line unicorn/prefer-module
            rootPath: path.join(__dirname, '..', '..', 'client', 'build'),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        VideosModule,
        BanksModule,
        InvoicesModule,
        MySqlModule,
        WsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: SqlExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        ApiKeyService,
    ],
})
export class AppModule {}
