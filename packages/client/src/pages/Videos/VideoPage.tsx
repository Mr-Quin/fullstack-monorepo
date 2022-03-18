import { Stack } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import shallow from 'zustand/shallow'
import { getAllVideos, removeVideos } from '../../actions/video.action'
import { VideoEntity } from '../../api/video.service'
import { renderTooltipCell } from '../../components/DataGrid/TooltipCell'
import { UidCell } from '../../components/DataGrid/UidCell'
import FormPage from '../../components/FormPage/FormPage'
import useStore from '../../store/globalStore'
import VideoForm from './VideoForm'

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 150,
        renderCell: renderTooltipCell,
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 200,
        sortable: false,
        renderCell: renderTooltipCell,
    },
    {
        field: 'duration',
        headerName: 'Duration',
        description: 'Length of the video in seconds',
    },
    { field: 'view_count', headerName: 'View Count', editable: true, width: 120 },
    {
        field: 'users',
        headerName: 'UIDs',
        description: 'User IDs of the author of this video',
        width: 120,
        renderCell: (rowData) => {
            console.log(rowData)
            return (
                <Stack direction={'row'} spacing={1}>
                    {rowData.value.map((user, i) => {
                        return <UidCell uid={user.uid} name={user.username} key={i} />
                    })}
                </Stack>
            )
        },
    },
    {
        field: 'created_at',
        headerName: 'Created At',
        width: 120,
        valueFormatter: (params) => {
            return new Date(params.value as string).toLocaleDateString()
        },
    },
]

const VideoPage = () => {
    const videoData = useStore((state) => state.videos, shallow)

    useEffect(() => {
        getAllVideos()
    }, [])

    return (
        <FormPage<VideoEntity>
            title={'Manage videos'}
            renderFormComponent={(formProps) => <VideoForm {...formProps} type={'create'} />}
            renderEditFormComponent={(formProps) => {
                const { initValue, ...bind } = formProps
                const { users, ...rest } = initValue!
                const user_ids = users.map((user) => user.uid) as number[]
                return <VideoForm {...bind} initValue={{ ...rest, user_ids }} type={'update'} />
            }}
            dataGridProps={{
                columns,
                rows: videoData,
            }}
            onDelete={removeVideos}
            buttonProps={{
                dialogButtonLabel: 'Add video',
            }}
        />
    )
}

export default VideoPage
