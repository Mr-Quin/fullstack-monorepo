import { Injectable } from '@nestjs/common'
import { DbService } from '../repository/repository.provider'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDetailEntity } from './entities/user-detail.entity'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(private readonly dbService: DbService) {}

    async create(createUserDto: CreateUserDto) {
        const { rows } = await this.dbService.pool.query(
            `
                INSERT INTO Users (username)
                VALUES ($1)
                RETURNING user_id as "insertId"`,
            [createUserDto.username]
        )

        return rows[0]
    }

    async findAll(): Promise<UserEntity[]> {
        const { rows } = await this.dbService.pool.query(
            `
            SELECT user_id, username, created_at
            FROM Users`
        )

        return rows as UserEntity[]
    }

    // Users who have a bank account and have submitted a video
    async findQualifiedUsers(): Promise<UserEntity[]> {
        const { rows } = await this.dbService.pool.query(
            `
            SELECT Users.user_id, username, Users.created_at
            FROM Users
                     JOIN Banks B on Users.user_id = B.user_id
                     JOIN User_Video UV on Users.user_id = UV.user_id
                     JOIN Videos V on UV.video_id = V.video_id
            GROUP BY Users.user_id
            HAVING COUNT(B.bank_id) > 0
               AND COUNT(V.video_id) > 0`
        )

        return rows as UserEntity[]
    }

    async findOne(id: number): Promise<UserDetailEntity> {
        const { rows } = await this.dbService.pool.query(
            `
                SELECT U.user_id,
                       U.created_at,
                       U.username,
                       COALESCE((SELECT json_agg(json_build_object('video_id', V.video_id,
                                                                   'title', V.title,
                                                                   'user_video_id', UV.user_video_id,
                                                                   'created_at', V.created_at))
                                 FROM Users SubU
                                          LEFT JOIN User_Video UV ON SubU.user_id = UV.user_id
                                          LEFT JOIN Videos V ON V.video_id = UV.video_id
                                 WHERE SubU.user_id = U.user_id
                                 GROUP BY SubU.user_id
                                 HAVING COUNT(V.video_id) > 0), '[]'::json) AS videos,
                       CASE
                           WHEN COUNT(B.bank_id) > 0
                               THEN json_agg(
                                   json_build_object('bank_id', B.bank_id,
                                                     'nickname', B.nickname))
                           ELSE '[]'::json
                           END                                              AS banks
                FROM Users U
                         LEFT JOIN Banks B ON B.user_id = U.user_id
                WHERE U.user_id = $1
                GROUP BY U.user_id`,
            [id]
        )

        // this should only find one result or nothing
        return rows[0] ?? null
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        // must use query instead of execute for object placeholder
        const result = await this.dbService.pool.query(
            `
                UPDATE Users
                SET ${this.dbService.toSetString(updateUserDto, 2)}
                WHERE user_id = $1`,
            [id, ...Object.values(updateUserDto)]
        )

        return this.dbService.rowCount(result)
    }

    async remove(id: number) {
        const result = await this.dbService.pool.query(
            `
                DELETE
                FROM Users
                WHERE user_id = $1`,
            [id]
        )

        return this.dbService.rowCount(result)
    }

    async removeMany(ids: number[]) {
        const result = await this.dbService.pool.query(
            `
                DELETE
                FROM Users
                WHERE user_id IN (${this.dbService.toValString(ids)})`,
            ids
        )

        return this.dbService.rowCount(result)
    }

    async exists(ids: number[]): Promise<boolean> {
        const { rows } = await this.dbService.pool.query(
            `
                SELECT COUNT(*)::int as count
                FROM Users
                WHERE user_id IN (${this.dbService.toValString(ids)})`,
            ids
        )

        return rows[0].count > 0
    }
}
