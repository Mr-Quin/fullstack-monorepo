import { config } from 'dotenv'
import mysql from 'mysql2'

config()

const createSqlConnection = () => {
    if (process.env.APP_MYSQL_PORT === undefined) {
        throw new Error('APP_MYSQL_PORT is not defined')
    }

    return mysql
        .createConnection({
            host: process.env.APP_MYSQL_HOST,
            port: +process.env.APP_MYSQL_PORT,
            user: process.env.APP_MYSQL_USER,
            password: process.env.APP_MYSQL_PASSWORD,
            database: process.env.APP_MYSQL_DATABASE,
        })
        .promise()
}

export const mysqlDb = createSqlConnection()
