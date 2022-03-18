import { Module } from '@nestjs/common'
import { BanksController } from './banks.controller'
import { BanksService } from './banks.service'
import { IsNicknameUniqueForUserRule } from './banks.validator'

@Module({
    controllers: [BanksController],
    providers: [BanksService, IsNicknameUniqueForUserRule],
})
export class BanksModule {}
