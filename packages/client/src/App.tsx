import AdapterLuxon from '@mui/lab/AdapterLuxon'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { Container } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import FetchData from './components/FetchData'
import Footer from './components/Footer'
import GlobalSnackbar from './components/GlobalSnackbar'
import HeaderBar from './components/HeaderBar'
import Instruction from './components/Instruction'
import NotFoundPage from './pages/404'
import Banks from './pages/Banks/BankPage'
import InvoicePage from './pages/Invoices/InvoicePage'
import UserPage from './pages/Users/UserPage'
import VideoPage from './pages/Videos/VideoPage'
import Ws from './ws/Ws'

const App = () => {
    return (
        <BrowserRouter>
            <Ws />
            <FetchData />
            <GlobalSnackbar />
            <HeaderBar />
            <Instruction />
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <Container sx={{ pt: 4, pb: 4, flexGrow: 1 }} component={'main'} maxWidth={'xl'}>
                    <Routes>
                        <Route path={'/'} element={<Navigate replace to={'/users'} />} />
                        <Route path={'/users'} element={<UserPage />} />
                        <Route path={'/videos'} element={<VideoPage />} />
                        <Route path={'/banks'} element={<Banks />} />
                        <Route path={'/invoices'} element={<InvoicePage />} />
                        <Route path={'*'} element={<NotFoundPage />} />
                    </Routes>
                </Container>
            </LocalizationProvider>
            <Footer />
        </BrowserRouter>
    )
}

export default App
