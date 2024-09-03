import { backendUrl } from "@/App";
import { FollowRequestsSent } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useFollowRequestsSent = () => {
    const [followRequestsSent,setFollowRequestsSent] = useState<FollowRequestsSent[]>([]);
    const [followRequestsSentCount,setFollowRequestsSentCount] = useState<number>(1);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchFollowRequestsSent = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/follow_requests_sent`,{
                    withCredentials:true,
                });
                setFollowRequestsSent(response.data.follow_requests_sent);
                setFollowRequestsSentCount(response.data.follow_requests_sent_count);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFollowRequestsSent();
    },[])

    return {followRequestsSent,followRequestsSentCount,isLoading,setFollowRequestsSent,setFollowRequestsSentCount}

}