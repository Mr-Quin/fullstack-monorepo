import { Inject, Injectable } from '@nestjs/common'
import { SqlResultDto } from '../common/dto/sql-result.dto'
import { MySql, MYSQL } from '../repository/repository.provider'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'
import { InvoiceEntity } from './entities/invoice.entity'

@Injectable()
export class InvoicesService {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async create(createInvoiceDto: CreateInvoiceDto): Promise<SqlResultDto> {
        const { user_video_id, bank_id, tier, paid_at } = createInvoiceDto

        const result = await this.mysql.execute(
            `
                INSERT INTO Invoices (user_video_id, username, video_title, bank_id, tier, paid_at)
                SELECT user_video_id, username, title as video_title, ?, ?, ?
                FROM User_Video
                         JOIN Users ON Users.user_id = User_Video.user_id
                         JOIN Videos ON Videos.video_id = User_Video.video_id
                WHERE User_Video.user_video_id = ?`,
            [bank_id, tier, paid_at, user_video_id]
        )

        return result[0]
    }

    async findAll(): Promise<InvoiceEntity[]> {
        const result = await this.mysql.execute(`
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

        return result[0]
    }

    async findOne(id: number): Promise<InvoiceEntity> {
        const result = await this.mysql.execute(
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
                WHERE invoice_id = ?`,
            [id]
        )

        return result[0][0] as InvoiceEntity
    }

    async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<SqlResultDto> {
        const { user_video_id, ...rest } = updateInvoiceDto

        const result = await this.mysql.query(
            `
                UPDATE Invoices
                SET ?
                WHERE invoice_id = ?`,
            [rest, id]
        )

        return result[0]
    }

    async removeMany(ids: number[]): Promise<SqlResultDto> {
        const res = await this.mysql.query(
            `
                DELETE
                FROM Invoices
                WHERE invoice_id IN (?)`,
            [ids]
        )

        return res[0]
    }
}
