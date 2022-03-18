import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common'
import { SqlResultDto } from '../common/dto/sql-result.dto'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { ParseIdPipe } from '../common/pipes/parse-id.pipe'
import { RemoveUndefinedPipe } from '../common/pipes/remove-undefined.pipe'
import { NotEmptyPipe } from '../common/validators/not-empty-pipe.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { RemoveInvoiceDto } from './dto/remove-invoice.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'
import { InvoiceEntity } from './entities/invoice.entity'
import { InvoicesService } from './invoices.service'

@Controller('invoices')
@UsePipes(new ParseIdPipe('id'))
@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) {}

    @Post()
    async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<SqlResultDto> {
        const res = await this.invoicesService.create(createInvoiceDto)
        return new SqlResultDto(res)
    }

    @Get()
    async findAll(): Promise<InvoiceEntity[]> {
        const res = await this.invoicesService.findAll()
        return res.map((invoice) => new InvoiceEntity(invoice))
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<InvoiceEntity> {
        return new InvoiceEntity(await this.invoicesService.findOne(id))
    }

    @Patch(':id')
    @UsePipes(new RemoveUndefinedPipe('body'), new NotEmptyPipe('body'))
    async update(
        @Param('id') id: number,
        @Body() updateInvoiceDto: UpdateInvoiceDto
    ): Promise<SqlResultDto> {
        if (updateInvoiceDto.user_video_id !== undefined) {
            // check uvid is not the only field to update
            if (Object.keys(updateInvoiceDto).length === 1) {
                throw new BadRequestException('Cannot update user_video_id without other fields')
            }

            // if uvid is set, check if it matches the current one
            const { user_video_id: oldUvid } = await this.invoicesService.findOne(id)
            if (oldUvid !== updateInvoiceDto.user_video_id) {
                throw new BadRequestException('Cannot change user_video_id')
            }
        }

        const res = await this.invoicesService.update(id, updateInvoiceDto)
        return new SqlResultDto(res)
    }

    @Delete()
    async removeMany(@Body() removeInvoiceDto: RemoveInvoiceDto): Promise<SqlResultDto> {
        const res = await this.invoicesService.removeMany(removeInvoiceDto.invoice_ids)
        return new SqlResultDto(res)
    }
}
