import { DatePicker } from '@mui/lab'
import { Autocomplete, Grid, TextField } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { updateInvoice } from '../../actions/invoice.action'
import { getUserDetails } from '../../actions/user.action'
import { InvoiceEntity, UpdateInvoiceDto } from '../../api/invoice.service'
import { UserDetailEntity } from '../../api/user.service'
import { EditFormProps } from '../../components/FormPage/FormPage'
import FormSection from '../../components/FormPage/FormSection'

const initState: UpdateInvoiceDto = {
    user_video_id: null,
    bank_id: null,
    tier: null,
    paid_at: null,
}

const getInitState = (value?: InvoiceEntity) => {
    if (value !== undefined) {
        const { user_video_id, bank_id, tier, paid_at } = value
        return {
            user_video_id,
            bank_id,
            tier,
            paid_at,
        }
    }
    return initState
}

const InvoiceEditForm = ({ onClose, initValue, id }: EditFormProps<InvoiceEntity>) => {
    const [formState, setFormState] = useState<UpdateInvoiceDto>(getInitState(initValue))
    const [error, setError] = useState('')
    const [userDetails, setUserDetails] = useState({
        loading: false,
        value: null as UserDetailEntity | null,
    })
    const [bank, setBank] = useState(null as UserDetailEntity['banks'][0] | null)

    useEffect(() => {
        if (initValue!.user_id === null) return
        getUserDetails(initValue!.user_id).then((userDetails) => {
            setUserDetails({
                value: userDetails,
                loading: false,
            })
            setBank(userDetails.banks.find((bank) => bank.bank_id === initValue!.bank_id) ?? null)
        })
        setUserDetails({
            loading: true,
            value: null,
        })
    }, [initValue!.user_id])

    const handleSubmit = async () => {
        try {
            await updateInvoice(id!, formState)
            onClose()
            return true
        } catch (error: any) {
            setError(error.message)
            return false
        }
    }

    const handleReset = () => {
        setFormState(getInitState(initValue))
        setBank(
            userDetails.value?.banks.find((bank) => bank.bank_id === initValue!.bank_id) ?? null
        )
    }

    return (
        <FormSection
            title={`Edit Invoice ${id}`}
            errorMessage={error}
            buttonProps={{
                onSubmit: handleSubmit,
                onCancel: handleReset,
                submitButtonText: 'Update invoice',
                cancelButtonText: 'Reset changes',
            }}
        >
            <Grid container spacing={2} alignItems={'flex-end'}>
                <Grid item xs={12}>
                    <Autocomplete
                        fullWidth
                        value={bank}
                        loading={userDetails.loading}
                        options={userDetails.value?.banks ?? []}
                        onChange={(e, value) => {
                            setBank(value)
                            setFormState({
                                ...formState,
                                bank_id: value?.bank_id ?? null,
                            })
                        }}
                        getOptionLabel={(option) => `${option.bank_id} - ${option.nickname}`}
                        renderInput={(params) => (
                            <TextField {...params} label={'Bank ID'} required />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label={'Tier'}
                        value={formState.tier}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setFormState({ ...formState, tier: e.target.value })
                        }}
                        inputProps={{
                            inputMode: 'numeric',
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePicker
                        label={'Date paid'}
                        value={formState.paid_at ?? null}
                        onChange={(newValue: string | null) => {
                            if (newValue !== null) {
                                setFormState({
                                    ...formState,
                                    paid_at: new Date(newValue).toISOString(),
                                })
                            } else {
                                setFormState({ ...formState, paid_at: null })
                            }
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
            </Grid>
        </FormSection>
    )
}

export default InvoiceEditForm
