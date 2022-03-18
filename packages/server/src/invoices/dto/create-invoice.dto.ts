import { IsDateString, IsInt, IsOptional, Min } from 'class-validator'
import { BankIdShouldBelongToUser } from '../invoices.validator'

export class CreateInvoiceDto {
    @IsInt()
    // this id is validated by BankIdShouldBelongToUser
    user_video_id: number

    @IsInt()
    @BankIdShouldBelongToUser()
    bank_id: number

    @IsInt()
    @Min(0)
    tier: number = 0

    @IsOptional()
    @IsDateString()
    paid_at: string = null
}
