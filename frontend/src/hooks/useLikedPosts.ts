import { backendUrl } from "@/App";
import { Post } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useLikedPosts = (page=1,limit=10) => {
    const [likedPosts,setLikedPosts] = useState<Post[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [noOfPages,setNoOfPages] = useState<number>(1);

    const params = new URLSearchParams();
    params.set("page",page.toString());
    params.set("limit",limit.toString());

    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/post/liked_posts?${params.toString()}`,{
                    withCredentials:true,
                });
                setLikedPosts(response.data.liked_posts);
                setNoOfPages(response.data.noOfPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLikedPosts();
    },[page,limit])

    return {likedPosts,isLoading,setLikedPosts,noOfPages}
}