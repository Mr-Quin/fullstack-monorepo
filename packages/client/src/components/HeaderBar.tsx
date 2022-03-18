import { Box } from '@mui/material'
import Logo from './Logo'
import NavTabs from './NavTabs'

const HeaderBar = () => {
    return (
        <Box
            component={'header'}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ backgroundColor: 'background.paper', height: 64 }}
        >
            <Logo />
            <NavTabs />
        </Box>
    )
}

export default HeaderBar
