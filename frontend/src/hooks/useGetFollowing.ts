import { backendUrl } from "@/App";
import { Following } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"


export const useGetFollowing = (userId?:string) => {
    const [following,setFollowing] = useState<Following[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [followingCount,setFollowingCount] = useState<number>(0);

    let api="";
    if(userId) {
        const params = new URLSearchParams();
        params.set("userId",userId);
        api=`${backendUrl}/api/user/following?${params.toString()}`;
    } else {
        api=`${backendUrl}/api/user/following`;
    }

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(api,{
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
    },[userId])

    return {following,isLoading,followingCount,setFollowing,setFollowingCount};

}