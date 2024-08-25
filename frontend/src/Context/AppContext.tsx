import Loader from "@/components/Loader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { AppContextType } from "@/types";
import { createContext } from "react";
export const AppContext = createContext<AppContextType | null>(null);

function AppContextProvider({children}:{children:React.ReactNode}) {

    const {isLoading,loggedInUser,setLoggedInUser} = useAuthUser();


    if(isLoading) return (
        <>
        <div className="flex justify-center my-[20%]">
            <Loader height="80" width="80" color="black"/>
        </div>
        </>
    )

    return (
        <>
            <AppContext.Provider value={{
                loggedInUser:loggedInUser,
                setLoggedInUser:setLoggedInUser,
            }}>
                {children}
            </AppContext.Provider>
        </>
    )
}

export default AppContextProvider;