import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator'
import { CreateInvoiceDto } from './create-invoice.dto'

export class UpdateInvoiceDto extends PartialType(OmitType(CreateInvoiceDto, ['tier', 'paid_at'])) {
    @IsOptional()
    @IsInt()
    @Min(0)
    tier: number

    @IsOptional()
    @IsDateString()
    paid_at: string
}
