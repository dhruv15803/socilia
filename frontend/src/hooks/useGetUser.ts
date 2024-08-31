import { backendUrl } from "@/App";
import { User } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"




export const useGetUser =  (userId:string) => {
    const [user,setUser] = useState<User | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/${userId}`);
                setUser(response.data.user);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        } 

        fetchUser();

    },[userId]);

    return {user,isLoading};

}