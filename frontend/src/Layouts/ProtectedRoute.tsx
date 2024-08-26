import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'
import  { useContext } from 'react'
import {Navigate, Outlet} from "react-router-dom"

const ProtectedRoute = () => {
    const {loggedInUser} = useContext(AppContext) as AppContextType;

    if(loggedInUser) return <Outlet/>
    
    return <Navigate to="/login"/>

}

export default ProtectedRoute;
