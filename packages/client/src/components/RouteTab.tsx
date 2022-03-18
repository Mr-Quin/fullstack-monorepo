import { Tab, TabProps } from '@mui/material'
import { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

type RouteTabProps = Pick<TabProps, 'label' | 'value' | 'sx'> &
    Omit<ComponentProps<typeof Link>, 'children'>

const RouteTab = (props: RouteTabProps) => {
    return <Tab component={Link} {...props} />
}

export default RouteTab
