import { styled } from '@mui/material'

const GradientLogo = styled('div')(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'italic',
    cursor: 'default',
    userSelect: 'none',
    paddingLeft: theme.spacing(2),
    flexShrink: 0,
    background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.secondary.light} 90%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: `drop-shadow(0 0px 10px ${theme.palette.primary.dark})`,
}))

const Logo = () => {
    return <GradientLogo>Group 1</GradientLogo>
}

export default Logo
