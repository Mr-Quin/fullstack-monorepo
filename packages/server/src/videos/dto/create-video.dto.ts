import { Type } from 'class-transformer'
import {
    ArrayMaxSize,
    ArrayMinSize,
    ArrayUnique,
    IsArray,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator'
import { UserShouldExist } from '../../users/users.validator'

export class CreateVideoDto {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    @Type(() => Number)
    @IsInt({ each: true })
    @ArrayUnique()
    @UserShouldExist()
    user_ids: number[]

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    title: string

    @IsString()
    @IsOptional()
    description: string = ''

    @IsInt()
    @IsPositive()
    duration: number

    @IsInt()
    @Min(0)
    @IsOptional()
    view_count: number = 0
}
