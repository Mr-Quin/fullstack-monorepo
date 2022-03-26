import { Injectable } from '@nestjs/common'
import { mapSeries } from 'async'
import { DbService } from '../repository/repository.provider'
import { CreateVideoDto } from './dto/create-video.dto'
import { FilterVideoDto } from './dto/filter-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { VideoEntity } from './entities/video.entity'

@Injectable()
export class VideosService {
    constructor(private readonly dbService: DbService) {}

    async create(createVideoDto: CreateVideoDto) {
        const { user_ids, ...videoData } = createVideoDto

        const [keyString, valString] = this.dbService.toInsertString(videoData)
        // insert the video
        const { rows } = await this.dbService.pool.query(
            `
                INSERT INTO Videos (${keyString})
                VALUES (${valString})
                RETURNING video_id as "insertId"
            `,
            Object.values(videoData)
        )

        const insertId = rows[0].insertId

        const jointData = user_ids.map((user_id) => [user_id, insertId])

        const valueString = jointData
            .map((data, i) => {
                return `($${(i + 1) * 2 - 1}, $${(i + 1) * 2})`
            })
            .join(', ')

        // insert the m:m relationship
        await this.dbService.pool.query(
            `
                INSERT INTO user_video (user_id, video_id)
                VALUES ${valueString}
            `,
            jointData.flat()
        )

        return rows[0]
    }

    async findAll(filterVideoDto: FilterVideoDto): Promise<VideoEntity[]> {
        // Fix ambiguous column name
        if (filterVideoDto.user_id) {
            filterVideoDto['users.user_id'] = filterVideoDto.user_id
            delete filterVideoDto.user_id
        }

        const whereClause =
            Object.keys(filterVideoDto).length > 0
                ? this.dbService.toWhereString(filterVideoDto)
                : `true`

        const { rows } = await this.dbService.pool.query(
            `
                SELECT Videos.video_id,
                       title,
                       description,
                       duration,
                       view_count,
                       json_agg(
                               json_build_object('uid', Users.user_id, 'uvid', user_video_id, 'username',
                                                 CASE
                                                     WHEN username IS NULL
                                                         THEN 'removed'
                                                     ELSE username
                                                     END
                                   )) AS users,
                       Videos.created_at
                FROM Videos
                         LEFT JOIN User_Video ON Videos.video_id = User_Video.video_id
                         LEFT JOIN Users ON Users.user_id = User_Video.user_id
                WHERE ${whereClause}
                GROUP BY Videos.video_id
                ORDER BY Videos.video_id
            `,
            Object.values(filterVideoDto)
        )

        return rows
    }

    async findOne(id: number): Promise<VideoEntity> {
        const { rows } = await this.dbService.pool.query(
            `
                SELECT Videos.video_id,
                       title,
                       description,
                       duration,
                       view_count,
                       created_at
                FROM Videos
                WHERE Videos.video_id = $1
            `,
            [id]
        )

        return rows[0]
    }

    async update(id: number, updateVideoDto: UpdateVideoDto) {
        const { user_ids, ...videoData } = updateVideoDto

        // update the video
        const result = await this.dbService.pool.query(
            `
                UPDATE Videos
                SET ${this.dbService.toSetString(videoData, 2)}
                WHERE video_id = $1
            `,
            [id, ...Object.values(videoData)]
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
            await mapSeries(oldRel, async (joint) => {
                const operator = joint[0] === null ? 'IS' : '='
                return this.dbService.pool.query(
                    `
                        DELETE
                        FROM User_Video
                        WHERE user_id ${operator} $1
                          AND video_id = $2
                    `,
                    joint
                )
            })

            // insert new relationship
            await mapSeries(newRel, async (joint) =>
                this.dbService.pool.query(
                    `
                        INSERT INTO User_Video (user_id, video_id)
                        VALUES (${this.dbService.toValString(joint)})
                    `,
                    joint
                )
            )
        }

        return this.dbService.rowCount(result)
    }

    async removeMany(ids: number[]) {
        const result = await this.dbService.pool.query(
            `
                DELETE
                FROM Videos
                WHERE video_id IN (${this.dbService.toValString(ids)});
            `,
            ids
        )

        // m:m relationship is deleted with cascade
        return this.dbService.rowCount(result)
    }

    private async findUids(id: number): Promise<number[]> {
        const { rows } = await this.dbService.pool.query(
            `
                SELECT json_agg(user_id) as user_ids
                FROM User_Video
                WHERE video_id = $1
                GROUP BY video_id;
            `,
            [id]
        )

        return rows[0].user_ids
    }
}
