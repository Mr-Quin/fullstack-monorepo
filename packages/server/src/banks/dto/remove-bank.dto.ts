import { IsArray, IsInt } from 'class-validator'

export class RemoveBankDto {
    @IsArray()
    @IsInt({ each: true })
    bank_ids: number[]
}
