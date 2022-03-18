import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class RemoveUndefinedPipe implements PipeTransform<any> {
    private readonly type: ArgumentMetadata['type']

    constructor(type: ArgumentMetadata['type']) {
        this.type = type
    }

    transform(value: any, metadata: ArgumentMetadata) {
        // remove undefined values on object
        if (metadata.type === this.type && typeof value === 'object') {
            Object.keys(value).forEach((key) => {
                if (value[key] === undefined) {
                    delete value[key]
                }
            })
        }

        return value
    }
}
