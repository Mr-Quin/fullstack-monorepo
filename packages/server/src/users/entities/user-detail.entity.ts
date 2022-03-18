import { Expose, Type } from 'class-transformer'
import { BankEntity } from '../../banks/entities/bank.entity'
import { VideoEntity } from '../../videos/entities/video.entity'
import { UserEntity } from './user.entity'

export class UserDetailEntity extends UserEntity {
    @Expose()
    @Type(() => VideoEntity)
    videos: VideoEntity[]

    @Expose()
    @Type(() => BankEntity)
    banks: BankEntity[]

    constructor(user: Partial<UserDetailEntity>) {
        super(user)
        Object.assign(this, user)
    }
}
