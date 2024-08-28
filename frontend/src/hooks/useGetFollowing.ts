import { backendUrl } from "@/App";
import { Following } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"


export const useGetFollowing = () => {
    const [following,setFollowing] = useState<Following[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [followingCount,setFollowingCount] = useState<number>(0);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/following`,{
                    withCredentials:true,
                });
                setFollowing(response.data.following);
                setFollowingCount(response.data.following_count);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFollowing();
    },[])

    return {following,isLoading,followingCount,setFollowing,setFollowingCount};

}