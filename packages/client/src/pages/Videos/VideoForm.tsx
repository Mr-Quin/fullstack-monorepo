import { Autocomplete, Grid, InputAdornment, TextField } from '@mui/material'
import { ChangeEvent, useReducer, useState } from 'react'
import { createVideo, updateVideo } from '../../actions/video.action'
import { CreateVideoDto } from '../../api/video.service'
import { EditFormProps } from '../../components/FormPage/FormPage'
import FormSection from '../../components/FormPage/FormSection'
import useStore from '../../store/globalStore'

const defaultState = {
    title: '',
    description: '',
    duration: '' as NumberOrString,
    view_count: '' as NumberOrString,
    user_ids: [] as number[],
}

const videoFormInitState = (initState?: CreateVideoDto): CreateVideoDto => {
    if (initState) {
        initState.user_ids.filter((user_id) => user_id !== null)
        return {
            ...defaultState,
            ...initState,
            user_ids: initState.user_ids.filter((user_id) => user_id !== null),
        }
    }
    return defaultState
}

type VideoFormState = CreateVideoDto
type VideoFormAction =
    | { type: 'users'; payload: number[] }
    | { type: 'title'; payload: string }
    | { type: 'description'; payload: string }
    | { type: 'duration'; payload: string }
    | { type: 'viewCount'; payload: string }
    | { type: 'reset'; payload?: CreateVideoDto }

const videoFormReducer = (state: VideoFormState, action: VideoFormAction): CreateVideoDto => {
    switch (action.type) {
        case 'users':
            return { ...state, user_ids: action.payload }
        case 'title':
            return { ...state, title: action.payload }
        case 'description':
            return { ...state, description: action.payload }
        case 'duration':
            return { ...state, duration: action.payload }
        case 'viewCount':
            return { ...state, view_count: action.payload }
        case 'reset':
            return videoFormInitState(action.payload)
        default:
            throw new Error('Unknown action type')
    }
}

type VideoFormProps = EditFormProps<VideoFormState> & { type: 'create' | 'update' }

const VideoForm = ({ onClose, initValue, type, id }: VideoFormProps) => {
    const [formState, formDispatch] = useReducer(videoFormReducer, videoFormInitState(initValue))
    const [error, setError] = useState('')
    const users = useStore((state) => state.users)
    const [autoCompleteUsers, setAutoCompleteUsers] = useState<any[]>(
        users.filter((user) => initValue?.user_ids.includes(user.user_id))
    )

    const handleSubmit = async () => {
        try {
            if (type === 'create') {
                await createVideo(formState)
            } else {
                await updateVideo(id!, formState)
            }
            onClose()
            return true
        } catch (error: any) {
            setError(error.message)
            return false
        }
    }

    const handleClear = () => {
        setError('')
        if (type === 'update') {
            formDispatch({ type: 'reset', payload: initValue })
            setAutoCompleteUsers(users.filter((user) => initValue?.user_ids.includes(user.user_id)))
        } else {
            formDispatch({ type: 'reset' })
            setAutoCompleteUsers([])
        }
    }

    return (
        <FormSection
            title={`${type === 'create' ? 'Create new video' : `Update video id ${id}`}`}
            errorMessage={error}
            buttonProps={{
                onSubmit: handleSubmit,
                onCancel: handleClear,
                submitButtonText: `${type === 'create' ? 'Create' : 'Update'} video`,
                cancelButtonText: `${type === 'create' ? 'Clear' : 'Reset changes'}`,
            }}
        >
            <Grid container spacing={2} alignItems={'flex-start'}>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        value={autoCompleteUsers}
                        options={users}
                        onChange={(e, value) => {
                            formDispatch({
                                type: 'users',
                                payload: value.map((v: any) => v.user_id as number),
                            })
                            setAutoCompleteUsers([...value])
                        }}
                        getOptionLabel={(option) => `${option.id} - ${option.username}`}
                        getOptionDisabled={() => autoCompleteUsers.length >= 2}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={'User ID(s)'}
                                required
                                helperText={`${
                                    type === 'create'
                                        ? 'A video can have up to 2 contributing users'
                                        : 'Modifying this field may cause invoices associated with this video to become invalid'
                                }`}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={'Video Title'}
                        value={formState.title}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'title', payload: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        multiline
                        fullWidth
                        label={'Video Description'}
                        value={formState.description}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'description', payload: e.target.value })
                        }
                        minRows={2}
                        maxRows={4}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth
                        required
                        label={'Duration'}
                        value={formState.duration}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'duration', payload: e.target.value })
                        }
                        sx={{
                            width: '16ch',
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position={'end'}>s</InputAdornment>,
                        }}
                        inputProps={{
                            inputMode: 'numeric',
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={'View count'}
                        value={formState.view_count}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'viewCount', payload: e.target.value })
                        }
                        inputProps={{
                            inputMode: 'numeric',
                        }}
                    />
                </Grid>
            </Grid>
        </FormSection>
    )
}

export default VideoForm
