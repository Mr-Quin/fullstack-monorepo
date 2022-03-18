import { Module } from '@nestjs/common'
import { InvoicesController } from './invoices.controller'
import { InvoicesService } from './invoices.service'
import { BankIdShouldBelongToUserRule } from './invoices.validator'

@Module({
    controllers: [InvoicesController],
    providers: [InvoicesService, BankIdShouldBelongToUserRule],
})
export class InvoicesModule {}
