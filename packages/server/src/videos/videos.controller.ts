import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common'
import { SqlResultDto } from '../common/dto/sql-result.dto'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { ParseIdPipe } from '../common/pipes/parse-id.pipe'
import { RemoveUndefinedPipe } from '../common/pipes/remove-undefined.pipe'
import { NotEmptyPipe } from '../common/validators/not-empty-pipe.service'
import { CreateVideoDto } from './dto/create-video.dto'
import { FilterVideoDto } from './dto/filter-video.dto'
import { RemoveVideoDto } from './dto/remove-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { VideoEntity } from './entities/video.entity'
import { VideosService } from './videos.service'

@Controller('videos')
@UsePipes(new ParseIdPipe('id'))
@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createVideoDto: CreateVideoDto): Promise<SqlResultDto> {
        const res = await this.videosService.create(createVideoDto)
        return new SqlResultDto(res)
    }

    @Get()
    async findAll(@Query() filterVideoDto: FilterVideoDto): Promise<VideoEntity[]> {
        const res = await this.videosService.findAll(filterVideoDto)
        return res.map((video) => new VideoEntity(video))
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<VideoEntity> {
        const res = await this.videosService.findOne(id)
        return new VideoEntity(res)
    }

    @Patch(':id')
    @UsePipes(new RemoveUndefinedPipe('body'), new NotEmptyPipe('body'))
    update(@Param('id') id: number, @Body() updateVideoDto: UpdateVideoDto): Promise<SqlResultDto> {
        return this.videosService.update(id, updateVideoDto)
    }

    @Delete()
    async remove(@Body() removeVideoDto: RemoveVideoDto): Promise<SqlResultDto> {
        const res = await this.videosService.removeMany(removeVideoDto.video_ids)
        return new SqlResultDto(res)
    }
}
