import { Inject, Injectable } from '@nestjs/common'
import { mapSeries } from 'async'
import { MySql, MYSQL } from '../repository/repository.provider'
import { CreateVideoDto } from './dto/create-video.dto'
import { FilterVideoDto } from './dto/filter-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { VideoEntity } from './entities/video.entity'

@Injectable()
export class VideosService {
    constructor(@Inject(MYSQL) private readonly mysql: MySql) {}

    async create(createVideoDto: CreateVideoDto) {
        const { user_ids, ...videoData } = createVideoDto

        // insert the video
        const insertedVideo = await this.mysql.query(
            `
                INSERT INTO Videos
                SET ?
            `,
            videoData
        )

        const lastInsertedId = insertedVideo[0].insertId

        const jointData = user_ids.map((user_id) => [user_id, lastInsertedId])

        // insert the m:m relationship
        await this.mysql.query(
            `
                INSERT INTO User_Video (user_id, video_id)
                VALUES ?
            `,
            [jointData]
        )

        return insertedVideo[0]
    }

    async findAll(filterVideoDto: FilterVideoDto): Promise<VideoEntity[]> {
        const whereClause = Object.keys(filterVideoDto).length > 0 ? `WHERE ?` : ``

        // Fix ambiguous column name
        if (filterVideoDto.user_id) {
            filterVideoDto['Users.user_id'] = filterVideoDto.user_id
            delete filterVideoDto.user_id
        }

        const result = await this.mysql.query(
            `
                SELECT Videos.video_id,
                       title,
                       description,
                       duration,
                       view_count,
                       JSON_ARRAYAGG(JSON_OBJECT('uid', Users.user_id, 'uvid', user_video_id, 'username',
                                                 IFNULL(username, 'removed'))) AS users,
                       Videos.created_at
                FROM Videos
                         LEFT JOIN User_Video ON Videos.video_id = User_Video.video_id
                         LEFT JOIN Users ON Users.user_id = User_Video.user_id
                    ${whereClause}
                GROUP BY Videos.video_id
            `,
            [filterVideoDto]
        )

        return result[0]
    }

    async findOne(id: number): Promise<VideoEntity> {
        const result = await this.mysql.execute(
            `
                SELECT Videos.video_id,
                       title,
                       description,
                       duration,
                       view_count,
                       created_at
                FROM Videos
                WHERE Videos.video_id = ?
            `,
            [id]
        )

        return result[0]
    }

    async findUids(id: number): Promise<number[]> {
        const result = await this.mysql.execute(
            `
                SELECT JSON_ARRAYAGG(user_id) as user_ids
                FROM User_Video
                WHERE video_id = ?
                GROUP BY video_id;
            `,
            [id]
        )

        return result[0][0].user_ids
    }

    async update(id: number, updateVideoDto: UpdateVideoDto) {
        const { user_ids, ...videoData } = updateVideoDto

        // update the video
        const result = await this.mysql.query(
            `
                UPDATE Videos
                SET ?
                WHERE video_id = ?
            `,
            [videoData, id]
        )

        // update the m:m relationship
        if (user_ids) {
            // find current user_ids
            const currentUserIds = await this.findUids(id)

            // only operate on the difference
            const newRel = user_ids
                .filter((user_id) => !currentUserIds.includes(user_id))
                .map((user_id) => [user_id, id])

            const oldRel = currentUserIds
                .filter((user_id) => !user_ids.includes(user_id))
                .map((user_id) => [user_id, id])

            // remove old relationship
            await mapSeries(oldRel, async (joint) =>
                this.mysql.query(
                    `
                        DELETE
                        FROM User_Video
                        WHERE user_id ${joint[0] === null ? 'IS' : '='} ?
                          AND video_id = ?
                    `,
                    joint
                )
            )

            // insert new relationship
            await mapSeries(newRel, async (joint) =>
                this.mysql.query(
                    `
                        INSERT INTO User_Video (user_id, video_id)
                        VALUES (?)
                    `,
                    [joint]
                )
            )
        }

        return result[0]
    }

    async removeMany(ids: number[]) {
        const result = await this.mysql.query(
            `
                DELETE
                FROM Videos
                WHERE video_id IN (?);
            `,
            [ids]
        )

        // also delete the m:m relationship, but ignore the result
        await this.mysql.query(
            `
                DELETE
                FROM User_Video
                WHERE video_id IN (?);
            `,
            [ids]
        )

        return result[0]
    }
}
