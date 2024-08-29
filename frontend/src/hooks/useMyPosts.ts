import { backendUrl } from "@/App";
import { Post } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useMyPosts = (page=1,limit=10) => {
    const [posts,setPosts] = useState<Post[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [noOfPages,setNoOfPages] = useState<number>(1);

    
    const params = new URLSearchParams();
    params.set("page",page.toString());
    params.set("limit",limit.toString());

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/post/my_posts?${params.toString()}`,{
                    withCredentials:true,
                });
                setPosts(response.data.posts);
                setNoOfPages(response.data.noOfPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMyPosts();
    },[page,limit]);

    return {posts,isLoading,setPosts,noOfPages};

}