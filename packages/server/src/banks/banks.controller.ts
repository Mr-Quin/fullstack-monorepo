import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    NotImplementedException,
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
import { BanksService } from './banks.service'
import { CreateBankDto } from './dto/create-bank.dto'
import { FilterBankDto } from './dto/filter-bank.dto'
import { RemoveBankDto } from './dto/remove-bank.dto'
import { UpdateBankDto } from './dto/update-bank.dto'
import { BankEntity } from './entities/bank.entity'

@Controller('banks')
@UsePipes(new ParseIdPipe('id'))
@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
export class BanksController {
    constructor(private readonly banksService: BanksService) {}

    @Post()
    async create(@Body() createBankDto: CreateBankDto): Promise<SqlResultDto> {
        return new SqlResultDto(await this.banksService.create(createBankDto))
    }

    @Get()
    async findAll(@Query() filterBankDto: FilterBankDto): Promise<BankEntity[]> {
        const res = await this.banksService.findAll(filterBankDto)
        return res.map((bank) => new BankEntity(bank))
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        throw new NotImplementedException()
        // return this.banksService.findOne(id)
    }

    @Patch(':id')
    @UsePipes(new RemoveUndefinedPipe('body'), new NotEmptyPipe('body'))
    async update(
        @Param('id') id: number,
        @Body() updateBankDto: UpdateBankDto
    ): Promise<SqlResultDto> {
        return new SqlResultDto(await this.banksService.update(id, updateBankDto))
    }

    @Delete()
    async remove(@Body() removeBankDto: RemoveBankDto): Promise<SqlResultDto> {
        return new SqlResultDto(await this.banksService.removeMany(removeBankDto.bank_ids))
    }
}
