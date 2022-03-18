export type InvoiceEntity = {
    invoice_id: number
    user_video_id: number | null
    username: string
    video_title: string
    bank_id: number | null
    user_id: number | null
    video_id: number | null
    tier: number
    paid_at: string | null
    created_at: string
}

export type CreateInvoiceDto = {
    user_video_id: NumberOrString
    bank_id: NumberOrString
    tier?: NumberOrString
    paid_at?: string
}

export type UpdateInvoiceDto = {
    user_video_id?: NumberOrString | null
    bank_id?: NumberOrString | null
    tier?: NumberOrString | null
    paid_at?: string | null
}
