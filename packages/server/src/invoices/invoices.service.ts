import { Injectable } from '@nestjs/common'
import { SqlResultDto } from '../common/dto/sql-result.dto'
import { DbService } from '../repository/repository.provider'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'
import { InvoiceEntity } from './entities/invoice.entity'

@Injectable()
export class InvoicesService {
    constructor(private readonly dbService: DbService) {}

    async create(createInvoiceDto: CreateInvoiceDto): Promise<SqlResultDto> {
        const { user_video_id, bank_id, tier, paid_at } = createInvoiceDto

        const { rows } = await this.dbService.pool.query(
            `
                INSERT INTO Invoices (user_video_id, username, video_title, bank_id, tier, paid_at)
                    SELECT user_video_id, username, title as video_title, $1, $2, $3
                    FROM User_Video
                             JOIN Users ON Users.user_id = User_Video.user_id
                             JOIN Videos ON Videos.video_id = User_Video.video_id
                    WHERE User_Video.user_video_id = $4
                RETURNING invoice_id as "insertId"
                `,
            [bank_id, tier, paid_at, user_video_id]
        )

        return rows[0]
    }

    async findAll(): Promise<InvoiceEntity[]> {
        const { rows } = await this.dbService.pool.query(`
            SELECT invoice_id,
                   I.user_video_id,
                   I.username,
                   UV.user_id,
                   UV.video_id,
                   I.video_title,
                   bank_id,
                   tier,
                   paid_at,
                   I.created_at
            FROM Invoices I
                     LEFT JOIN User_Video UV on I.user_video_id = UV.user_video_id
                     LEFT JOIN Users U ON U.user_id = UV.user_id
        `)

        return rows
    }

    async findOne(id: number): Promise<InvoiceEntity> {
        const { rows } = await this.dbService.pool.query(
            `
                SELECT invoice_id,
                       user_video_id,
                       username,
                       video_title,
                       bank_id,
                       tier,
                       paid_at,
                       created_at
                FROM Invoices
                WHERE invoice_id = $1`,
            [id]
        )

        return rows[0] as InvoiceEntity
    }

    async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
        const { user_video_id, ...rest } = updateInvoiceDto

        // TODO: check if bank_id belongs to user
        const result = await this.dbService.pool.query(
            `
                UPDATE invoices
                SET ${this.dbService.toSetString(rest, 2)}
                WHERE invoice_id = $1
            `,
            [id, ...Object.values(rest)]
        )

        return this.dbService.rowCount(result)
    }

    async removeMany(ids: number[]) {
        const result = await this.dbService.pool.query(
            `
                DELETE
                FROM invoices
                WHERE invoice_id IN (${this.dbService.toValString(ids)});
            `,
            ids
        )

        return this.dbService.rowCount(result)
    }
}
