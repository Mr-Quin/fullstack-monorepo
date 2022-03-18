import { Autocomplete, Stack, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { getUserDetails } from '../../actions/user.action'
import { UserDetailEntity } from '../../api/user.service'
import useStore from '../../store/globalStore'

type Step2Props = {
    uid?: NumberOrString | null
    onBankChange: (bank: UserDetailEntity['banks'][0] | null) => void
    onVideoChange: (video: UserDetailEntity['videos'][0] | null) => void
}

const Step2 = ({ uid, onBankChange, onVideoChange }: Step2Props) => {
    const [userDetails, setUserDetails] = useState({
        loading: false,
        value: null as UserDetailEntity | null,
    })
    const [bank, setBank] = useState(null as UserDetailEntity['banks'][0] | null)
    const [video, setVideo] = useState(null as UserDetailEntity['videos'][0] | null)
    const invoiceData = useStore((state) => state.invoices)

    const prevUid = useRef(uid)

    useEffect(() => {
        if (uid === undefined || uid === null) return
        if (prevUid.current === uid) return
        // every time the uid changes, we need to fetch the user details and clear existing values
        onBankChange(null)
        onVideoChange(null)
        setBank(null)
        setVideo(null)
        prevUid.current = uid
        getUserDetails(uid).then((userDetails) => {
            setUserDetails({
                value: userDetails,
                loading: false,
            })
        })
        setUserDetails({
            loading: true,
            value: null,
        })
    }, [uid])

    return (
        <Stack spacing={2}>
            <Autocomplete
                fullWidth
                value={video}
                loading={userDetails.loading}
                options={
                    userDetails.value?.videos.filter(
                        (video) =>
                            invoiceData.find(
                                (invoice) => invoice.user_video_id === video.user_video_id
                            ) === undefined
                    ) ?? []
                }
                onChange={(e, value) => {
                    onVideoChange(value)
                    setVideo(value)
                }}
                getOptionLabel={(option) => `${option.video_id} - ${option.title}`}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={'Video ID'}
                        required
                        helperText={
                            'If there are no options, all videos by this user already has an invoice. ' +
                            'Delete existing invoices or choose another user.'
                        }
                    />
                )}
            />
            <Autocomplete
                fullWidth
                value={bank}
                loading={userDetails.loading}
                options={userDetails.value?.banks ?? []}
                onChange={(e, value) => {
                    onBankChange(value)
                    setBank(value)
                }}
                getOptionLabel={(option) => `${option.bank_id} - ${option.nickname}`}
                renderInput={(params) => <TextField {...params} label={'Bank ID'} required />}
            />
        </Stack>
    )
}

export default Step2
