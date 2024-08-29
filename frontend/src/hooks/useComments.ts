import { backendUrl } from "@/App";
import { Comment } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"



export const useComments = (postId:string,page=1,limit=10) => {
    const [comments,setComments] = useState<Comment[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [noOfPages,setNoOfPages] = useState<number>(1);

    const params = new URLSearchParams();
    params.set("page",page.toString());
    params.set("limit",limit.toString());

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/comment/comments/${postId}?${params.toString()}`);
                setComments(response.data.comments);
                setNoOfPages(response.data.noOfPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchComments();
    },[postId,page,limit])

    return {comments,setComments,isLoading,noOfPages};
}