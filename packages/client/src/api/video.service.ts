export type VideoEntity = {
    video_id: number
    title: string
    description: string
    duration: number
    view_count: number
    users: {
        uid: number
        uvid: number
        username: string
    }[]
    created_at: string
}

export type CreateVideoDto = {
    title: string
    description: string
    duration: NumberOrString
    view_count: NumberOrString
    user_ids: number[]
}

export type UpdateVideoDto = CreateVideoDto
