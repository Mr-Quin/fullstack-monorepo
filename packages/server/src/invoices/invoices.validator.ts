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
@ValidatorConstraint({ name: 'BankIdShouldBelongToUser', async: true })
export class BankIdShouldBelongToUserRule implements ValidatorConstraintInterface {
    constructor(private readonly dbService: DbService) {}

    async validate(value: any, args: ValidationArguments) {
        // @ts-ignore
        const uvid = args.object?.user_video_id
        if (!value || uvid === undefined) {
            return true
        }

        const { rows } = await this.dbService.pool.query(
            `
                SELECT *
                FROM User_Video
                         JOIN Banks on Banks.user_id = User_Video.user_id
                WHERE bank_id = $1
                  AND user_video_id = $2
            `,
            [value, uvid]
        )

        // If there's no result, the bank does not belong to user, return false
        return rows.length > 0
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
