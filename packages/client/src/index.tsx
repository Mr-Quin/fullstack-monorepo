import { CssBaseline, styled } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'
import Theme from './Theme'

const Backdrop = styled('div')(({ theme }) => ({
    background: theme.palette.background.default,
    minHeight: '100vh',
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
}))

ReactDOM.render(
    <React.StrictMode>
        <Theme>
            <CssBaseline enableColorScheme />
            <Backdrop>
                <App />
            </Backdrop>
        </Theme>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
