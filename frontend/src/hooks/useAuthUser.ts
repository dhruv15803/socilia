import { backendUrl } from "@/App";
import { User } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"


export const useAuthUser = () => {
    const [loggedInUser,setLoggedInUser] = useState<User | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/auth/current`,{
                    withCredentials:true,
                });
                console.log(response);
                setLoggedInUser(response.data.user);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    },[])

    return {loggedInUser,isLoading,setLoggedInUser};

}