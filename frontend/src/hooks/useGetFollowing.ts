import { backendUrl } from "@/App";
import { Following } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"


export const useGetFollowing = () => {
    const [following,setFollowing] = useState<Following[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/following`,{
                    withCredentials:true,
                });
                setFollowing(response.data.following);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFollowing();
    },[])

    return {following,isLoading};

}