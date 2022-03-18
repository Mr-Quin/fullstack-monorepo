import { Inject, Injectable } from '@nestjs/common'
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { MySql, MYSQL } from '../repository/repository.provider'

@Injectable()
@ValidatorConstraint({ name: 'UserShouldExistRule', async: true })
export class UserShouldExistRule implements ValidatorConstraintInterface {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async validate(value: any, args: ValidationArguments) {
        if (value === undefined) {
            return true
        }

        value = Array.isArray(value) ? value : [value]

        if (value.length === 0) {
            return true
        }

        const result = await this.mysql.query(
            `
                SELECT COUNT(*) AS count
                FROM Users
                WHERE user_id in (?)`,
            [value]
        )
        const countObj = result[0][0]

        if (!countObj || Object.values(countObj).at(0) < value.length) {
            return false
        }

        return true
    }

    defaultMessage(args: ValidationArguments) {
        return `At least one user in [${args.value}] does not exist`
    }
}

export const UserShouldExist =
    (validationOptions?: ValidationOptions) => (object: any, propertyName: string) => {
        registerDecorator({
            name: 'UserExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UserShouldExistRule,
        })
    }
