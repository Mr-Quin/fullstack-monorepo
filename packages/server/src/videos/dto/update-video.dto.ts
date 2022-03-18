import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { CreateVideoDto } from './create-video.dto'

export class UpdateVideoDto extends PartialType(
    OmitType(CreateVideoDto, ['description', 'view_count'])
) {
    @IsString()
    @IsOptional()
    description: string

    @IsInt()
    @Min(0)
    @IsOptional()
    view_count: number
}
