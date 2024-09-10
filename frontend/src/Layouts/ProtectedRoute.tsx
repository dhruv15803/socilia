import Loader from '@/components/Loader'
import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'
import  { useContext } from 'react'
import {Navigate, Outlet} from "react-router-dom"

const ProtectedRoute = () => {
    const {loggedInUser,isLoading} = useContext(AppContext) as AppContextType;

    if(isLoading) {
        console.log('waiting....');
        return (
            <>
                <div className='flex items-center gap-2 justify-center'>
                    <Loader width='80' height='80' color='black'/>
                    <span className='font-semibold'>Loading...</span>
                </div>
            </>
        )
    }

    if(loggedInUser!==null) {
        return <Outlet/>;
    } else {
        return <Navigate to="/login"/>;
    }

}

export default ProtectedRoute;
