import { backendUrl } from "@/App";
import { Follower } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useGetFollowers = (userId?:string) => {
    const [followers,setFollowers] = useState<Follower[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [followersCount,setFollowersCount] = useState<number>(0);

    let api="";
    if(userId) {
        const params = new URLSearchParams();
        params.set("userId",userId);
        api=`${backendUrl}/api/user/followers?${params.toString()}`;
    } else {
        api=`${backendUrl}/api/user/followers`;
    }

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(api,{
                    withCredentials:true,
                });
                setFollowers(response.data.followers);
                setFollowersCount(response.data.followers_count);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFollowers();
    },[userId])

    return {isLoading,followers,followersCount,setFollowers,setFollowersCount}
}