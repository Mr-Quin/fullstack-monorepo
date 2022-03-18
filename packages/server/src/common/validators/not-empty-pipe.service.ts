import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class NotEmptyPipe implements PipeTransform<any> {
    private readonly type: ArgumentMetadata['type']

    constructor(type: ArgumentMetadata['type']) {
        this.type = type
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === this.type && typeof value === 'object') {
            if (Object.values(value).filter((v) => v !== undefined && v !== null).length === 0) {
                throw new BadRequestException('Body must contain at least one field')
            }
        }
        return value
    }
}
