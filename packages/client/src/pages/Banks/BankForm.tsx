import { Autocomplete, Grid, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { ChangeEvent, useReducer, useState } from 'react'
import { createBank, updateBank } from '../../actions/bank.action'
import { CreateBankDto } from '../../api/bank.service'
import { EditFormProps } from '../../components/FormPage/FormPage'
import FormSection from '../../components/FormPage/FormSection'
import useStore from '../../store/globalStore'

const defaultState: CreateBankDto = {
    user_id: '',
    nickname: '',
    bank_name: '',
    account_number: '',
    routing_number: '',
    type: 'checking',
}

const bankFormInitState = (defaultValue?: CreateBankDto): CreateBankDto => {
    return {
        ...defaultState,
        ...defaultValue,
    }
}

type BankFormState = CreateBankDto
type BankFormAction =
    | { type: 'user'; payload: NumberOrString }
    | { type: 'nickname'; payload: string }
    | { type: 'bankName'; payload: string }
    | { type: 'accountNumber'; payload: NumberOrString }
    | { type: 'routingNumber'; payload: NumberOrString }
    | { type: 'type'; payload: CreateBankDto['type'] }
    | { type: 'reset'; payload?: CreateBankDto }

const bankFormReducer = (state: BankFormState, action: BankFormAction): BankFormState => {
    switch (action.type) {
        case 'user':
            return { ...state, user_id: action.payload }
        case 'nickname':
            return { ...state, nickname: action.payload }
        case 'bankName':
            return { ...state, bank_name: action.payload }
        case 'accountNumber':
            return { ...state, account_number: action.payload }
        case 'routingNumber':
            return { ...state, routing_number: action.payload }
        case 'type':
            return { ...state, type: action.payload ?? state.type }
        case 'reset':
            return bankFormInitState(action.payload)
        default:
            throw new Error('Invalid action type')
    }
}

type BankFormProps = EditFormProps<CreateBankDto> & { type: 'create' | 'update' }

const BankForm = ({ onClose, initValue, type, id }: BankFormProps) => {
    const [formState, formDispatch] = useReducer(bankFormReducer, bankFormInitState(initValue))
    const [error, setError] = useState('')
    const users = useStore((state) => state.users)
    const [autocompleteValue, setAutocompleteValue] = useState<any>(
        users.find((user) => user.user_id === initValue?.user_id) ?? null
    )

    const handleSubmit = async () => {
        try {
            if (type === 'create') {
                await createBank(formState)
            } else {
                await updateBank(id!, formState)
            }
            onClose()
            return true
        } catch (error: any) {
            setError(error.message)
            return false
        }
    }

    const handleClear = () => {
        if (type === 'create') {
            formDispatch({ type: 'reset' })
            setAutocompleteValue(null)
        } else {
            formDispatch({ type: 'reset', payload: initValue })
            setAutocompleteValue(users.find((user) => user.user_id === initValue!.user_id) ?? null)
        }
    }

    return (
        <FormSection
            title={`${type === 'create' ? 'Create new bank account' : `Update bank account ${id}`}`}
            errorMessage={error}
            buttonProps={{
                onSubmit: handleSubmit,
                onCancel: handleClear,
                submitButtonText: `${type === 'create' ? 'Add' : 'Update'} bank account`,
                cancelButtonText: `${type === 'create' ? 'Clear' : 'Reset changes'}`,
            }}
        >
            <Grid container spacing={2} alignItems={'flex-end'}>
                <Grid item xs={12}>
                    <Autocomplete
                        disabled={type === 'update'}
                        options={users}
                        value={autocompleteValue}
                        onChange={(e, value) => {
                            formDispatch({
                                type: 'user',
                                payload: value?.user_id ?? '',
                            })
                            setAutocompleteValue(value)
                        }}
                        getOptionLabel={(option) => `${option.user_id} - ${option.username}`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={'User ID'}
                                required
                                helperText={`${
                                    type === 'update' ? 'User ID cannot be changed' : ''
                                }`}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label={'Account nickname'}
                        value={formState.nickname}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'nickname', payload: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        label={'Bank name'}
                        value={formState.bank_name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'bankName', payload: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <ToggleButtonGroup
                        fullWidth
                        exclusive
                        size={'small'}
                        color={'primary'}
                        value={formState.type}
                        onChange={(e, value) => formDispatch({ type: 'type', payload: value })}
                    >
                        <ToggleButton value={'checking'}>Checking</ToggleButton>
                        <ToggleButton value={'savings'}>Savings</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        label={'Account number'}
                        value={formState.account_number}
                        inputProps={{
                            inputMode: 'numeric',
                        }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'accountNumber', payload: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        label={'Routing number'}
                        value={formState.routing_number}
                        inputProps={{
                            inputMode: 'numeric',
                        }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            formDispatch({ type: 'routingNumber', payload: e.target.value })
                        }
                    />
                </Grid>
            </Grid>
        </FormSection>
    )
}

export default BankForm
