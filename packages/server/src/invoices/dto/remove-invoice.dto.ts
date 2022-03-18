import { IsArray, IsInt } from 'class-validator'

export class RemoveInvoiceDto {
    @IsArray()
    @IsInt({ each: true })
    invoice_ids: number[]
}
