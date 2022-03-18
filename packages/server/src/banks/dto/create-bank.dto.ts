import {
    IsAlphanumeric,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumberString,
    IsString,
    MaxLength,
} from 'class-validator'
import { UserShouldExist } from '../../users/users.validator'
import { IsNicknameUniqueForUser } from '../banks.validator'

export class CreateBankDto {
    @IsInt()
    @UserShouldExist()
    user_id: number

    @IsString()
    @IsNotEmpty()
    @IsNicknameUniqueForUser()
    @MaxLength(25)
    nickname: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    bank_name: string

    @IsNumberString()
    @IsAlphanumeric(undefined, { message: 'account_number cannot contain special characters' })
    @IsNotEmpty()
    account_number: string

    @IsNumberString()
    @IsAlphanumeric(undefined, { message: 'routing_number cannot contain special characters' })
    @IsNotEmpty()
    routing_number: string

    @IsEnum(['checking', 'savings'], {
        message: 'Account type must be either checking or savings',
    })
    type: 'checking' | 'savings'
}
