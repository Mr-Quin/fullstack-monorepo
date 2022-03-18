import { createTheme, ThemeProvider } from '@mui/material/styles'
import { PropsWithChildren } from 'react'

const theme = createTheme({
    typography: {
        fontFamily: [
            'Maison Neue',
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1800,
        },
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#4ba0d1',
        },
        secondary: {
            main: '#a178ff',
        },
        background: {
            default: '#313138',
            paper: '#24242a',
        },
        text: {
            primary: '#fff',
            secondary: '#cdcdcd',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {},
        },
        MuiTextField: {
            defaultProps: {
                variant: 'standard',
            },
        },
        MuiChip: {
            defaultProps: {
                size: 'small',
            },
        },
    },
})

const Theme = (props: PropsWithChildren<any>) => {
    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

export default Theme
