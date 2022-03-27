import { Injectable } from '@nestjs/common'
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { DbService } from '../repository/repository.provider'

@Injectable()
@ValidatorConstraint({ name: 'IsNickNameUniqueForUser', async: true })
export class IsNicknameUniqueForUserRule implements ValidatorConstraintInterface {
    constructor(private readonly dbService: DbService) {}

    async validate(value: any, args: ValidationArguments) {
        // @ts-ignore
        const uid = args.object?.user_id
        if (!value || uid === undefined) {
            return true
        }

        const { rows } = await this.dbService.pool.query(
            `
                SELECT *
                FROM Banks
                WHERE nickname = $1
                  AND user_id = $2
            `,
            [value, uid]
        )

        // if we have a result, then the nickname is not unique, so we return false
        return rows.length <= 0
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
