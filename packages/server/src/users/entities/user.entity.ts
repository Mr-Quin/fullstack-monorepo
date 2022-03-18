import { Expose } from 'class-transformer'

export class UserEntity {
    @Expose()
    user_id: number
    @Expose()
    username: string
    @Expose()
    created_at: string

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }
}
