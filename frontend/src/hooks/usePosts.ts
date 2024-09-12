import { backendUrl } from "@/App";
import { Post } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"


export const usePosts = (page=1,limit=10) => {
    const [posts,setPosts] = useState<Post[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [noOfPages,setNoOfPages] = useState<number>(0);

    const params = new URLSearchParams();
    params.set("page",page.toString());
    params.set("limit",limit.toString());

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/post/posts?${params.toString()}`);
                console.log(response);
                setPosts((prevPosts) => [...prevPosts,...response.data.posts]);
                setNoOfPages(response.data.noOfPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
    },[page,limit]);

    return {posts,isLoading,noOfPages,setPosts};
}