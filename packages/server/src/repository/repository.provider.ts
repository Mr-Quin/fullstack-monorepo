import { Pool, QueryResult } from 'pg'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

const parseBoolean = (value?: string | boolean): boolean => {
    if (typeof value === 'boolean') return value
    if (value === undefined) return false
    if (value === 'true') return true
    if (value === 'false') return false
    throw new Error(`Invalid boolean value: ${value}`)
}

@Injectable()
export class DbService {
    pool: Pool

    constructor(private readonly configService: ConfigService) {
        const ssl =
            parseBoolean(this.configService.get('APP_DB_SSL', true)) === true
                ? {
                      rejectUnauthorized: false,
                  }
                : false
        this.pool = new Pool({
            host: configService.get('APP_DB_HOST'),
            user: configService.get('APP_DB_USER'),
            password: configService.get('APP_DB_PASSWORD'),
            database: configService.get('APP_DB_DATABASE'),
            port: +configService.get('APP_DB_PORT'),
            ssl,
        })
    }

    rowCount(result: QueryResult): { rowCount: number } {
        return { rowCount: result.rowCount }
    }

    // return something like '$1, $2, $3'
    toValString(values: any[], startVal: number = 1): string {
        return values.map((v, i) => `$${i + startVal}`).join(', ')
    }

    toInsertString(obj: object, startVal: number = 1): [string, string] {
        const keys = Object.keys(obj)
        const keyString = keys.join(', ')
        const valString = keys.map((k, i) => `$${i + startVal}`).join(', ')
        return [keyString, valString]
    }

    toWhereString(obj: object, startVal: number = 1): string {
        return Object.keys(obj)
            .map((k, i) => `${k} = $${i + startVal}`)
            .join(' AND ')
    }

    // return something like 'key1 = $1, key2 = $2, key3 = $3'
    toSetString(obj: object, startVal: number = 1): string {
        return Object.keys(obj)
            .map((k, i) => `${k} = $${i + startVal}`)
            .join(', ')
    }
}
