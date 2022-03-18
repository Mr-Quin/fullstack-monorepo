import { Inject, Injectable } from '@nestjs/common'
import { SqlResultDto } from '../common/dto/sql-result.dto'
import { MySql, MYSQL } from '../repository/repository.provider'
import { CreateBankDto } from './dto/create-bank.dto'
import { FilterBankDto } from './dto/filter-bank.dto'
import { UpdateBankDto } from './dto/update-bank.dto'
import { BankEntity } from './entities/bank.entity'

@Injectable()
export class BanksService {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async create(createBankDto: CreateBankDto) {
        const result = await this.mysql.query(
            `
                INSERT INTO Banks
                SET ?
            `,
            createBankDto
        )

        return result[0]
    }

    async findAll(filterBankDto: FilterBankDto): Promise<BankEntity[]> {
        const whereClause = Object.keys(filterBankDto).length > 0 ? `WHERE ?` : ``

        const result = await this.mysql.query(
            `
                SELECT bank_id,
                       user_id,
                       bank_name,
                       nickname,
                       account_number,
                       routing_number,
                       type,
                       created_at
                FROM Banks ${whereClause}`,
            [filterBankDto]
        )
        return result[0]
    }

    findOne(id: number) {
        return `This action returns a #${id} bank`
    }

    async update(id: number, updateBankDto: UpdateBankDto): Promise<SqlResultDto> {
        const result = await this.mysql.query(
            `
                UPDATE Banks
                SET ?
                WHERE bank_id = ?
            `,
            [updateBankDto, id]
        )

        return result[0]
    }

    async removeMany(ids: number[]): Promise<SqlResultDto> {
        const result = await this.mysql.query(
            `
                DELETE
                FROM Banks
                WHERE bank_id IN (?)
            `,
            [ids]
        )

        return result[0]
    }
}
