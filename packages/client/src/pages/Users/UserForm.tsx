import { Grid, TextField } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { createUser, updateUser, validateUsername } from '../../actions/user.action'
import { CreateUserDto } from '../../api/user.service'
import { EditFormProps } from '../../components/FormPage/FormPage'
import FormSection from '../../components/FormPage/FormSection'

const formInitState = (initValue?: CreateUserDto) => {
    return { value: initValue?.username ?? '', error: false, helperText: '', disabled: false }
}

type UserFormProps = EditFormProps<CreateUserDto> & { type: 'create' | 'update' }

const UserForm = ({ onClose, initValue, type, id }: UserFormProps) => {
    const [formState, setFormState] = useState(formInitState(initValue))

    const handleSubmit = async () => {
        try {
            setFormState((prevState) => ({ ...prevState, disabled: true }))
            if (type === 'create') {
                await createUser({ username: formState.value })
            } else {
                await updateUser(id!, { username: formState.value })
            }

            // artificial delay to show success
            // or show a snackbar?
            setTimeout(() => {
                onClose()
            }, 300)

            return true
        } catch (error: any) {
            setFormState((prevState) => ({
                ...prevState,
                error: true,
                helperText: error.message,
                disabled: false,
            }))
            return false
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        try {
            validateUsername(event.target.value)
            setFormState({
                value: event.target.value,
                error: false,
                helperText: '',
                disabled: false,
            })
        } catch (e: any) {
            setFormState({
                value: event.target.value,
                error: true,
                helperText: e?.message ?? 'unknown error',
                disabled: false,
            })
        }
    }

    const handleReset = () => {
        setFormState(formInitState(initValue))
    }

    return (
        <FormSection
            title={`${type === 'create' ? 'Create new user' : `Update user ${id}`}`}
            buttonProps={{
                onSubmit: handleSubmit,
                onCancel: handleReset,
                submitButtonText: `${type === 'create' ? 'Create' : 'Update'} user`,
                cancelButtonText: `${type === 'create' ? 'Clear' : 'Reset changes'}`,
            }}
        >
            <Grid container spacing={2} alignItems={'flex-start'}>
                <Grid item xs={6}>
                    <TextField
                        autoFocus
                        fullWidth
                        label={'Username'}
                        required
                        size={'small'}
                        onChange={handleChange}
                        {...formState}
                    />
                </Grid>
            </Grid>
        </FormSection>
    )
}

export default UserForm
