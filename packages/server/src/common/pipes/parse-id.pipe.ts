import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseIdPipe implements PipeTransform<any, number> {
    constructor(private readonly key: string | string[]) {
        if (typeof key === 'string') {
            this.key = [key]
        }
    }

    transform(value: any, metadata: ArgumentMetadata): number {
        if (!this.key.includes(metadata.data)) {
            return value
        }

        const val = parseInt(value, 10)

        if (isNaN(val)) {
            throw new BadRequestException(`${metadata.data} must be a number`)
        }

        return val
    }
}
