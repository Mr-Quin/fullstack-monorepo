import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UserExistsPipe } from './users.pipe'
import { UsersService } from './users.service'
import { UserShouldExistRule } from './users.validator'

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UsersService, UserShouldExistRule, UserExistsPipe],
})
export class UsersModule {}
