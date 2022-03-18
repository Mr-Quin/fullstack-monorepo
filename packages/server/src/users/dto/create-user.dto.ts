import { IsAlphanumeric, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsAlphanumeric()
    @MinLength(3)
    @MaxLength(20)
    username: string
}
