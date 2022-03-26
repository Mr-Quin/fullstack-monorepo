import { Connection } from 'mysql2'
import { Pool, QueryResult } from 'pg'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

export type MySql = Connection

export const MYSQL = Symbol('MYSQL')

@Injectable()
export class DbService {
    pool: Pool

    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool({
            host: configService.get('APP_DB_HOST'),
            user: configService.get('APP_DB_USER'),
            password: configService.get('APP_DB_PASSWORD'),
            database: configService.get('APP_DB_DATABASE'),
            port: +configService.get('APP_DB_PORT'),
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
