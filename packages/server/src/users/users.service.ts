import { Inject, Injectable } from '@nestjs/common'
import { MySql, MYSQL } from '../repository/repository.provider'
import { CreateUserDto } from './dto/create-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDetailEntity } from './entities/user-detail.entity'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async create(createUserDto: CreateUserDto) {
        const result = await this.mysql.execute(
            `
                INSERT INTO Users (username)
                VALUES (?)`,
            [createUserDto.username]
        )

        return result[0]
    }

    async findAll(filter: FilterUserDto): Promise<UserEntity[]> {
        if (filter.qualified) return this.findQualifiedUsers()

        const result = await this.mysql.execute(`
            SELECT user_id, username, created_at
            FROM Users
        `)
        return result[0] as UserEntity[]
    }

    // Users who have a bank account and have submitted a video
    async findQualifiedUsers(): Promise<UserEntity[]> {
        const result = await this.mysql.execute(`
            SELECT Users.user_id, username, Users.created_at
            FROM Users
                     JOIN Banks B on Users.user_id = B.user_id
                     JOIN User_Video UV on Users.user_id = UV.user_id
                     JOIN Videos V on UV.video_id = V.video_id
            GROUP BY Users.user_id
            HAVING COUNT(B.bank_id) > 0
               AND COUNT(V.video_id) > 0
        `)

        return result[0] as UserEntity[]
    }

    async findOne(id: number): Promise<UserDetailEntity> {
        const result = await this.mysql.execute(
            `
                SELECT U.user_id,
                       U.created_at,
                       U.username,
                       IFNULL((SELECT JSON_ARRAYAGG(JSON_OBJECT('video_id', V.video_id,
                                                                'title', V.title,
                                                                'user_video_id', UV.user_video_id,
                                                                'created_at', V.created_at))
                               FROM Users SubU
                                        LEFT JOIN User_Video UV ON SubU.user_id = UV.user_id
                                        LEFT JOIN Videos V ON V.video_id = UV.video_id
                               WHERE SubU.user_id = U.user_id
                               GROUP BY SubU.user_id
                               HAVING COUNT(V.video_id) > 0), JSON_ARRAY())           AS videos,
                       IF(COUNT(B.bank_id > 0),
                          JSON_ARRAYAGG(
                                  JSON_OBJECT('bank_id', B.bank_id,
                                              'nickname', B.nickname)), JSON_ARRAY()) AS banks
                FROM Users U
                         LEFT JOIN Banks B ON B.user_id = U.user_id
                WHERE U.user_id = ?
                GROUP BY U.user_id;
            `,
            [id]
        )
        // this should only find one result or nothing
        return result[0][0] ?? null
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        // must use query instead of execute for object placeholder
        const result = await this.mysql.query(
            `
                UPDATE Users
                SET ?
                WHERE user_id = ?`,
            [updateUserDto, id]
        )

        return result[0]
    }

    async remove(id: number) {
        const result = await this.mysql.execute(
            `
                DELETE
                FROM Users
                WHERE user_id = ?`,
            [id]
        )

        return result[0]
    }

    async removeMany(ids: number[]) {
        const result = await this.mysql.query(
            `
                DELETE
                FROM Users
                WHERE user_id IN (?)`,
            [ids]
        )

        return result[0]
    }

    async exists(id: number): Promise<boolean> {
        const result = await this.mysql.execute(
            `
                SELECT COUNT(*)
                FROM Users
                WHERE user_id = ?`,
            [id]
        )
        const countObj = result[0][0]

        if (!countObj) {
            return false
        }

        return Object.values(countObj).at(0) > 0
    }
}
