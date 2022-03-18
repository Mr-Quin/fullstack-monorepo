import { Button, CircularProgress } from '@mui/material'
import { MouseEvent, useState } from 'react'

export type SubmitButtonProps = {
    onSubmit: () => Promise<boolean>
    label?: string
}

const SubmitButton = ({ onSubmit, label }: SubmitButtonProps) => {
    const [{ submitting, success }, setSubmissionState] = useState({
        submitting: false,
        success: false,
    })

    const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setSubmissionState({ submitting: true, success: false })
        const result = await onSubmit()
        setSubmissionState({ submitting: false, success: result })
    }

    const buttonColor = success ? 'success.dark' : 'primary.dark'
    const buttonText = success ? 'Submitted' : label ?? 'Submit'

    return (
        <Button
            variant={'contained'}
            type={'submit'}
            onClick={handleSubmit}
            sx={{ color: 'text.primary', backgroundColor: buttonColor }}
            disabled={submitting || success}
        >
            {buttonText}
            {submitting && (
                <CircularProgress
                    size={24}
                    sx={{
                        color: 'text.secondary',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
        </Button>
    )
}

export default SubmitButton
