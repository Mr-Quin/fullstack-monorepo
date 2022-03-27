import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { UsersService } from './users.service'

@Injectable()
export class UserExistsPipe implements PipeTransform<number, Promise<number>> {
    constructor(private readonly usersService: UsersService) {}

    async transform(id: number, metadata: ArgumentMetadata): Promise<number> {
        // pass non-number values
        if (typeof id !== 'number') {
            return id
        }

        if (await this.usersService.exists([id])) {
            return id
        }

        throw new NotFoundException(`User with id ${id} not found`)
    }
}
