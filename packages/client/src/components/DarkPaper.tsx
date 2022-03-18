import { Paper, PaperProps, styled } from '@mui/material'

const SectionPaper = styled((props: PaperProps) => <Paper {...props} component={'section'} />)(
    ({ theme }) => ({
        background: theme.palette.background.paper,
        padding: theme.spacing(2),
    })
)

export default SectionPaper
