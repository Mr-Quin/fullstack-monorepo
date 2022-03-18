import { IsArray, IsInt } from 'class-validator'

export class RemoveVideoDto {
    @IsArray()
    @IsInt({ each: true })
    video_ids: number[]
}
