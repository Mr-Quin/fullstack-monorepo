import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { URLSearchParams } from 'node:url'

@Injectable()
export class ApiKeyService {
    apiKey: string

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get('APP_API_KEY')
        if (!this.apiKey) {
            throw new Error('api key is not defined')
        }
    }

    validate(key: any) {
        return key === this.apiKey
    }

    validateHttpRequest(req: any) {
        return this.validate(req?.headers?.['api-key'])
    }

    validateQueryString(querystring: string) {
        const [, query] = querystring.split('/?')
        if (!query) {
            return false
        }
        return this.validate(new URLSearchParams(query).get('api-key'))
    }
}
