import { Expose } from 'class-transformer'

export class InvoiceEntity {
    @Expose()
    invoice_id: number

    @Expose()
    user_video_id: number | null

    @Expose()
    username: string

    @Expose()
    video_title: string

    @Expose()
    bank_id: number

    @Expose()
    tier: number

    @Expose()
    paid_at: string | null

    @Expose()
    created_at: string

    constructor(data: Partial<InvoiceEntity>) {
        Object.assign(this, data)
    }
}
