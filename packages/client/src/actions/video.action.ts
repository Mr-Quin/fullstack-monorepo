import { fetchApi } from '../api/fetchApi'
import { CreateVideoDto, UpdateVideoDto } from '../api/video.service'
import useStore, { setSnackbar } from '../store/globalStore'

export const getAllVideos = async () => {
    useStore.setState({ isLoading: true })
    const res = await fetchApi('/videos')
    useStore.setState({ isLoading: false })

    if (res.error) {
        throw new Error(res.message)
    }

    const videos = res.data.map((video) => {
        return {
            ...video,
            id: video.video_id,
        }
    })

    useStore.setState({ videos })

    return videos
}

export const createVideo = async (video: CreateVideoDto) => {
    const res = await fetchApi('/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(video),
    })

    if (res.error) throw new Error(res.message)

    setSnackbar({
        message: `Created video id ${res.data.insertId}`,
        type: 'success',
    })

    return getAllVideos()
}

export const updateVideo = async (id: NumberOrString, video: UpdateVideoDto) => {
    const res = await fetchApi(`/videos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(video),
    })

    if (res.error) throw new Error(res.message)

    setSnackbar({
        message: `Updated video id ${id}`,
        type: 'success',
    })

    return getAllVideos()
}

export const removeVideos = async (id: NumberOrString[]) => {
    const res = await fetchApi(`/videos`, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            video_ids: id,
        }),
        method: 'DELETE',
    })

    if (res.error) {
        throw new Error(res.message)
    }

    if (res.data.affectedRows === 0) {
        setSnackbar({
            message: `Video already deleted`,
            type: 'error',
        })
    } else {
        setSnackbar({
            message: `Deleted ${res.data.affectedRows} ${
                res.data.affectedRows === 1 ? 'video' : 'videos'
            }`,
            type: 'success',
        })
    }
    return getAllVideos()
}
