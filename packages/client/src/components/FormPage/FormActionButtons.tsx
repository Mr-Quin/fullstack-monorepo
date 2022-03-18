import { Button, Stack } from '@mui/material'
import { useState } from 'react'
import SubmitButton from './SubmitButton'

export type FormActionButtonsProps = {
    onCancel: () => void
    onSubmit: () => Promise<boolean>
    submitButtonText?: string
    cancelButtonText?: string
}

const FormActionButtons = (props: FormActionButtonsProps) => {
    const [{ submitting, success }, setSubmissionState] = useState({
        submitting: false,
        success: false,
    })

    const handleSubmit = async () => {
        setSubmissionState({ submitting: true, success: false })
        const result = await props.onSubmit()
        setSubmissionState({ submitting: false, success: result })
        return result
    }

    return (
        <Stack direction={'row'} spacing={1} justifyContent={'center'} width={'100%'}>
            <SubmitButton onSubmit={handleSubmit} label={props.submitButtonText} />
            <Button
                variant={'outlined'}
                color={'primary'}
                onClick={props.onCancel}
                disabled={submitting || success}
            >
                {props.cancelButtonText ?? 'Clear'}
            </Button>
        </Stack>
    )
}

export default FormActionButtons
