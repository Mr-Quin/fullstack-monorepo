import { Connection } from 'mysql2'

export type MySql = Connection

export const MYSQL = Symbol('MYSQL')
