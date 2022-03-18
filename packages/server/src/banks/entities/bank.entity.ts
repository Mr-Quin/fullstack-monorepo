import { Expose } from 'class-transformer'

export class BankEntity {
    @Expose()
    bank_id: number

    @Expose()
    user_id: number

    @Expose()
    nickname: string

    @Expose()
    bank_name: string

    @Expose()
    account_number: number

    @Expose()
    routing_number: number

    @Expose()
    type: 'checking' | 'savings'

    @Expose()
    created_at: string

    constructor(data: Partial<BankEntity>) {
        Object.assign(this, data)
    }
}
