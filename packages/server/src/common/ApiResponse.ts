export interface Response {
    data: any
    status?: number
    message?: string
}

export class ApiResponse<T> {
    public readonly data: T
    public readonly status: number
    public readonly message: string

    constructor(response: Response) {
        this.data = response.data
        this.status = response.status
        this.message = response.message ?? 'OK'
    }
}
