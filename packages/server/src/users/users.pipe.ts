import {
    ArgumentMetadata,
    Inject,
    Injectable,
    NotFoundException,
    PipeTransform,
} from '@nestjs/common'
import { MySql, MYSQL } from '../repository/repository.provider'

@Injectable()
export class UserExistsPipe implements PipeTransform<number, Promise<number>> {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async transform(id: number, metadata: ArgumentMetadata): Promise<number> {
        // pass non-number values
        if (typeof id !== 'number') {
            return id
        }

        const result = await this.mysql.execute(
            `
                SELECT COUNT(*)
                FROM Users
                WHERE user_id = ?`,
            [id]
        )
        const countObj = result[0][0]

        if (!countObj || Object.values(countObj).at(0) <= 0) {
            throw new NotFoundException(`User with id ${id} not found`)
        }

        return id
    }
}
