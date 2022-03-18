import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { CreateVideoDto } from './create-video.dto'

export class FilterVideoDto extends PartialType(
    OmitType(CreateVideoDto, ['description', 'view_count', 'user_ids'])
) {
    @IsInt()
    @IsOptional()
    declare user_id: number

    @IsString()
    @IsOptional()
    declare description: string

    @IsInt()
    @IsOptional()
    declare view_count: number
}
