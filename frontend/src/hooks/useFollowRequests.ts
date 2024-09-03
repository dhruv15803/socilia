import { backendUrl } from "@/App";
import { FollowRequests } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useFollowRequests = () => {
    const [followRequests,setFollowRequests] = useState<FollowRequests[]>([]);
    const [followRequestsCount,setFollowRequestsCount] = useState<number>(0);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchFollowRequests = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/follow_requests`,{
                    withCredentials:true,
                });
                setFollowRequests(response.data.follow_requests);
                setFollowRequestsCount(response.data.follow_requests_count);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFollowRequests();
    },[])

    return {followRequests,setFollowRequests,isLoading,followRequestsCount,setFollowRequestsCount}

}