import React from 'react'
import { useLocation } from 'react-router'
import { School } from '@material-ui/icons'

export const Brand: React.FC = () => {
    const location = useLocation()

    if (location.pathname === '/' || location.pathname === '/about')
        return <School />;
    else
        return <>CougarGrades.io</>;
}
