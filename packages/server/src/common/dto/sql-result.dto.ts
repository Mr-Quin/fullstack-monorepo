import { Exclude, Expose } from 'class-transformer'

export class SqlResultDto {
    @Exclude()
    fieldCount: number

    @Expose()
    affectedRows: number

    @Expose()
    insertId: number

    @Exclude()
    info: string

    @Exclude()
    serverStatus: number

    @Exclude()
    warningStatus: number

    @Expose()
    changedRows: number

    constructor(result: Partial<SqlResultDto>) {
        Object.assign(this, result)
    }
}
