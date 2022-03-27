import { Injectable } from '@nestjs/common'
import { DbService } from '../repository/repository.provider'
import { CreateBankDto } from './dto/create-bank.dto'
import { FilterBankDto } from './dto/filter-bank.dto'
import { UpdateBankDto } from './dto/update-bank.dto'
import { BankEntity } from './entities/bank.entity'

@Injectable()
export class BanksService {
    constructor(private readonly dbService: DbService) {}

    async create(createBankDto: CreateBankDto) {
        const [keyString, valString] = this.dbService.toInsertString(createBankDto)

        const { rows } = await this.dbService.pool.query(
            `
                INSERT INTO banks (${keyString})
                VALUES (${valString})
                RETURNING bank_id as "insertId"
            `,
            Object.values(createBankDto)
        )

        return rows[0]
    }

    async findAll(filterBankDto: FilterBankDto): Promise<BankEntity[]> {
        const whereClause =
            Object.keys(filterBankDto).length > 0
                ? this.dbService.toWhereString(filterBankDto)
                : `true`

        const { rows } = await this.dbService.pool.query(
            `
                SELECT bank_id,
                       user_id,
                       bank_name,
                       nickname,
                       account_number,
                       routing_number,
                       type,
                       created_at
                FROM Banks
                WHERE ${whereClause}
                `,
            Object.values(filterBankDto)
        )

        return rows
    }

    findOne(id: number) {
        return `not implemented`
    }

    async update(id: number, updateBankDto: UpdateBankDto) {
        const result = await this.dbService.pool.query(
            `
                UPDATE banks
                SET ${this.dbService.toSetString(updateBankDto, 2)}
                WHERE bank_id = $1
            `,
            [id, ...Object.values(updateBankDto)]
        )

        return this.dbService.rowCount(result)
    }

    async removeMany(ids: number[]) {
        const result = await this.dbService.pool.query(
            `
                DELETE
                FROM banks
                WHERE bank_id IN (${this.dbService.toValString(ids)});
            `,
            ids
        )

        return this.dbService.rowCount(result)
    }
}
