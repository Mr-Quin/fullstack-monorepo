import { DatePicker } from '@mui/lab'
import { Box, Button, Collapse, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material'
import { ChangeEvent, useReducer, useState } from 'react'
import { createInvoice } from '../../actions/invoice.action'
import { FormProps } from '../../components/FormPage/FormPage'
import FormSection from '../../components/FormPage/FormSection'
import SubmitButton from '../../components/FormPage/SubmitButton'
import Step1 from './Step1'
import Step2 from './Step2'

const invoiceFormInitState = {
    user_id: null as number | null,
    video_id: null as number | null,
    user_video_id: null as number | null,
    bank_id: null as number | null,
    tier: '0',
    paid_at: null as Date | null,
}

type InvoiceFormState = typeof invoiceFormInitState
type InvoiceFormAction =
    | { type: 'uvid'; payload: number | null }
    | { type: 'uid'; payload: number | null }
    | { type: 'vid'; payload: number | null }
    | { type: 'bankId'; payload: number | null }
    | { type: 'tier'; payload: string }
    | { type: 'paidAt'; payload: Date | null }
    | { type: 'reset' }

const invoiceFormReducer = (
    state: InvoiceFormState,
    action: InvoiceFormAction
): InvoiceFormState => {
    switch (action.type) {
        case 'uvid':
            return { ...state, user_video_id: action.payload }
        case 'uid':
            return { ...state, user_id: action.payload }
        case 'vid':
            return { ...state, video_id: action.payload }
        case 'bankId':
            return { ...state, bank_id: action.payload }
        case 'tier':
            return { ...state, tier: action.payload }
        case 'paidAt':
            return { ...state, paid_at: action.payload }
        case 'reset':
            return invoiceFormInitState
        default:
            throw new Error('Invalid action type')
    }
}

const steps = ['Select User', 'Select Video and Bank', 'Payment info'] as const

const InvoiceForm = ({ onClose }: FormProps) => {
    const [formState, formDispatch] = useReducer(invoiceFormReducer, invoiceFormInitState)
    const [error, setError] = useState('')
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const nextButtonDisabled = () => {
        if (activeStep === 0) {
            return formState.user_id === null
        } else if (activeStep === 1) {
            return formState.user_video_id === null || formState.bank_id === null
        } else {
            return false
        }
    }

    const handleSubmit = async () => {
        try {
            const { user_video_id, bank_id, tier, paid_at } = formState
            await createInvoice({
                user_video_id: user_video_id!,
                bank_id: bank_id!,
                tier: tier,
                // toISO is a luxon method
                // @ts-ignore
                paid_at: paid_at?.toISO() as string,
            })
            onClose()
            return true
        } catch (error: any) {
            setError(error.message)
            return false
        }
    }

    const handleClear = () => {
        formDispatch({ type: 'reset' })
        setActiveStep(0)
    }

    return (
        <FormSection
            noButtons
            title={'Create invoice'}
            errorMessage={error}
            buttonProps={{
                onSubmit: handleSubmit,
                onCancel: handleClear,
                submitButtonText: 'Create invoice',
            }}
        >
            <Stack
                direction={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                width={'100%'}
            >
                <Box width={'100%'} display={'flex'} justifyContent={'center'} mb={4}>
                    <Stepper activeStep={activeStep} sx={{ width: '80%' }}>
                        {steps.map((label, i) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box>
                    <Collapse in={activeStep === 0}>
                        <Step1
                            onChange={(user) => {
                                formDispatch({ type: 'uid', payload: user?.user_id ?? null })
                            }}
                        />
                    </Collapse>
                    <Collapse in={activeStep === 1}>
                        <Step2
                            uid={formState.user_id}
                            onVideoChange={(video) => {
                                formDispatch({
                                    type: 'uvid',
                                    payload: video?.user_video_id ?? null,
                                })
                            }}
                            onBankChange={(bank) => {
                                formDispatch({ type: 'bankId', payload: bank?.bank_id ?? null })
                            }}
                        />
                    </Collapse>
                    <Collapse in={activeStep === 2}>
                        <Stack spacing={2}>
                            <TextField
                                label={'Tier'}
                                value={formState.tier}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    formDispatch({ type: 'tier', payload: e.target.value })
                                }
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                            />
                            <DatePicker
                                label={'Date paid'}
                                value={formState.paid_at}
                                onChange={(newValue) => {
                                    formDispatch({ type: 'paidAt', payload: newValue })
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </Collapse>
                </Box>
            </Stack>
            <Stack direction={'row'} spacing={1} justifyContent={'center'} width={'100%'} mt={2}>
                <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant={'outlined'}
                    color={'primary'}
                >
                    Back
                </Button>
                {activeStep === steps.length - 1 ? (
                    <SubmitButton onSubmit={handleSubmit} />
                ) : (
                    <Button
                        onClick={handleNext}
                        sx={{ color: 'text.primary', backgroundColor: 'primary.dark' }}
                        variant={'contained'}
                        disabled={nextButtonDisabled()}
                    >
                        Next
                    </Button>
                )}
            </Stack>
        </FormSection>
    )
}

export default InvoiceForm
