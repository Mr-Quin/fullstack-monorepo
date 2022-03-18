import { Expose } from 'class-transformer'

export class VideoEntity {
    @Expose()
    video_id: number

    @Expose()
    title: string

    @Expose()
    description: string

    @Expose()
    duration: number

    @Expose()
    view_count: number

    @Expose()
    created_at: string

    @Expose()
    users: [{ uid: number; uvid: number; username: string }]

    constructor(video: Partial<VideoEntity>) {
        Object.assign(this, video)
    }
}
