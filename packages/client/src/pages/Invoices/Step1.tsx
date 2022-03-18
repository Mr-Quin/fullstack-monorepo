import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { getQualifiedUsers } from '../../actions/user.action'
import { UserEntity } from '../../api/user.service'

type Step1Props = {
    onChange: (user: UserEntity | null) => void
}

const Step1 = ({ onChange }: Step1Props) => {
    const [users, setUsers] = useState<UserEntity[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getQualifiedUsers().then((users) => {
            setUsers(users)
            setIsLoading(false)
        })
        setIsLoading(true)
    }, [])

    return (
        <Autocomplete
            fullWidth
            options={users}
            loading={isLoading}
            onChange={(e, value) => {
                onChange(value)
            }}
            getOptionLabel={(option) => `${option.user_id} - ${option.username}`}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={'User ID'}
                    required
                    helperText={
                        'Only users who have submitted a video and have linked a bank account are shown here'
                    }
                />
            )}
        />
    )
}

export default Step1
