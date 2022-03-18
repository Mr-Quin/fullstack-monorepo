import { alpha, styled, Tabs } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import RouteTab from './RouteTab'

const tabs = ['Users', 'Videos', 'Banks', 'Invoices']

const getTabByPath = (pathname: string) => {
    if (pathname.length <= 1) return tabs[0]
    return tabs.find((tab) => pathname.toLowerCase().includes(tab.toLowerCase())) ?? tabs[0]
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
    padding: theme.spacing(2),
    paddingRight: 0,
    height: '100%',
    boxSizing: 'content-box', // fix for css baseline
    '& .MuiTabs-scroller': {
        overflow: 'visible !important',
        height: '100%',
        '& .MuiTabs-flexContainer': {
            height: '100%',
        },
    },
    '& .MuiTabs-indicator': {
        boxShadow: `0px 0px ${theme.spacing(1)} ${theme.spacing(0.25)} ${alpha(
            theme.palette.primary.main,
            0.8
        )}`,
    },
}))

const NavTabs = () => {
    const { pathname } = useLocation()
    const [value, setValue] = useState(getTabByPath(pathname))

    // listen to path changes
    useEffect(() => {
        setValue(getTabByPath(pathname))
    }, [pathname])

    return (
        <StyledTabs value={value} variant={'scrollable'} selectionFollowsFocus>
            {tabs.map((tab) => (
                <RouteTab key={tab} label={tab} value={tab} to={`/${tab.toLowerCase()}`} />
            ))}
        </StyledTabs>
    )
}

export default NavTabs
