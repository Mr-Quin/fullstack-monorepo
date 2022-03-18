import { IsArray, IsInt } from 'class-validator'

export class RemoveUserDto {
    @IsArray()
    @IsInt({ each: true })
    user_ids: number[]
}
