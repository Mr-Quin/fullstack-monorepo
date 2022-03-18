export type BankEntity = {
    bank_id: number
    user_id: number
    nickname: string
    bank_name: string
    account_number: string
    routing_number: string
    type: 'checking' | 'savings'
    created_at: string
}

export type CreateBankDto = {
    user_id: NumberOrString
    nickname: string
    bank_name: string
    account_number: NumberOrString
    routing_number: NumberOrString
    type: 'checking' | 'savings'
}

export type UpdateBankDto = Omit<CreateBankDto, 'user_id'>
