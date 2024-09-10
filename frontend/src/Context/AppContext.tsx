import { useAuthUser } from "@/hooks/useAuthUser";
import { AppContextType } from "@/types";
import { createContext } from "react";
export const AppContext = createContext<AppContextType | null>(null);

function AppContextProvider({children}:{children:React.ReactNode}) {

    const {isLoading,loggedInUser,setLoggedInUser} = useAuthUser();


    return (
        <>
            <AppContext.Provider value={{
                loggedInUser:loggedInUser,
                setLoggedInUser:setLoggedInUser,
                isLoading:isLoading,
            }}>
                {children}
            </AppContext.Provider>
        </>
    )
}

export default AppContextProvider;