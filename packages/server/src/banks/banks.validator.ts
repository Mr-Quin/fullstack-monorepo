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
@ValidatorConstraint({ name: 'IsNickNameUniqueForUser', async: true })
export class IsNicknameUniqueForUserRule implements ValidatorConstraintInterface {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async validate(value: any, args: ValidationArguments) {
        // @ts-ignore
        if (!value || args.object?.user_id === undefined) {
            return true
        }

        const result = await this.mysql.query(
            `
                SELECT *
                FROM Banks
                WHERE nickname = ?
                  AND user_id = ?
            `,
            // @ts-ignore
            [value, args.object?.user_id]
        )

        // if we have a result, then the nickname is not unique, so we return false
        return result[0].length <= 0
    }

    defaultMessage(args: ValidationArguments) {
        // @ts-ignore
        return `User ${args.object.user_id} already has a bank with nickname ${args.value}`
    }
}

export const IsNicknameUniqueForUser =
    (validationOptions?: ValidationOptions) => (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsNicknameUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsNicknameUniqueForUserRule,
        })
    }
