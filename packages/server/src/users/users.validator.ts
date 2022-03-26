import { Injectable } from '@nestjs/common'
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { UsersService } from './users.service'

@Injectable()
@ValidatorConstraint({ name: 'UserShouldExistRule', async: true })
export class UserShouldExistRule implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) {}

    async validate(value: any, args: ValidationArguments) {
        if (value === undefined) {
            return true
        }

        value = Array.isArray(value) ? value : [value]

        if (value.length === 0) {
            return true
        }

        return this.usersService.exists(value)
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
