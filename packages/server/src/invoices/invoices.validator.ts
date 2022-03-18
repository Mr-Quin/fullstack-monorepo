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
@ValidatorConstraint({ name: 'BankIdShouldBelongToUser', async: true })
export class BankIdShouldBelongToUserRule implements ValidatorConstraintInterface {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async validate(value: any, args: ValidationArguments) {
        // @ts-ignore
        if (!value || args.object?.user_video_id === undefined) {
            return true
        }

        const result = await this.mysql.query(
            `
                SELECT *
                FROM User_Video
                         JOIN Banks on Banks.user_id = User_Video.user_id
                WHERE bank_id = ?
                  AND user_video_id = ?;
            `,
            // @ts-ignore
            [value, args.object?.user_video_id]
        )

        // If there's no result, the bank does not belong to user, return false
        return result[0].length > 0
    }

    defaultMessage(args: ValidationArguments) {
        // @ts-ignore
        return `Bad bank_id and user combination`
    }
}

export const BankIdShouldBelongToUser =
    (validationOptions?: ValidationOptions) => (object: any, propertyName: string) => {
        registerDecorator({
            name: 'BankIdShouldBelongToUser',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: BankIdShouldBelongToUserRule,
        })
    }
