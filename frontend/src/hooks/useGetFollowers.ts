import { backendUrl } from "@/App";
import { Follower } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useGetFollowers = () => {
    const [followers,setFollowers] = useState<Follower[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [followersCount,setFollowersCount] = useState<number>(0);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/followers`,{
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
    },[])

    return {isLoading,followers,followersCount,setFollowers,setFollowersCount}
}