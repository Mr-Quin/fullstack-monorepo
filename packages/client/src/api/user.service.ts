export type UserEntity = { user_id: number; username: string; created_at: string }

export type UserDetailEntity = UserEntity & {
    videos: {
        title: string
        video_id: number
        user_video_id: number
    }[]
    banks: {
        bank_id: number
        nickname: string
    }[]
}

export type CreateUserDto = {
    username: string
}
