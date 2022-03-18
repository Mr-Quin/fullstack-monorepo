import { Box, FormHelperText, styled, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'
import SectionPaper from '../DarkPaper'
import FormActionButtons, { FormActionButtonsProps } from './FormActionButtons'

const CustomStack = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: theme.spacing(4),
}))

export type FormSectionProps = PropsWithChildren<{
    title: string
    elevation?: number
    errorMessage?: string
    buttonProps: FormActionButtonsProps
    noButtons?: boolean
}>

const FormSection = ({
    children,
    title,
    elevation,
    errorMessage,
    buttonProps,
    noButtons,
}: FormSectionProps) => {
    return (
        <SectionPaper elevation={elevation ?? 8}>
            <form noValidate>
                <CustomStack>
                    <Box>
                        <Typography variant={'h6'} component={'legend'}>
                            {title}
                        </Typography>
                    </Box>
                    {errorMessage && (
                        <FormHelperText error>
                            {errorMessage.split(',').map((error, index) => (
                                <Typography
                                    component={'span'}
                                    sx={{ display: 'block' }}
                                    key={index}
                                >
                                    {error}
                                </Typography>
                            ))}
                        </FormHelperText>
                    )}
                    {children}
                    {noButtons ? null : <FormActionButtons {...buttonProps} />}
                </CustomStack>
            </form>
        </SectionPaper>
    )
}

export default FormSection
