import { PartialType } from '@nestjs/mapped-types'
import { IsInt } from 'class-validator'
import { CreateBankDto } from './create-bank.dto'

export class FilterBankDto extends PartialType(CreateBankDto) {
    @IsInt()
    declare user_id: number
}
