import { backendUrl } from "@/App";
import { Comment } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"



export const useComments = (postId:string,parentCommentId?:string,page=1,limit=10) => {
    const [comments,setComments] = useState<Comment[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [noOfPages,setNoOfPages] = useState<number>(1);

    const params = new URLSearchParams();
    params.set("page",page.toString());
    params.set("limit",limit.toString());

    let api="";
    let isChildComments=false;
    if(parentCommentId) {
        api=`${backendUrl}/api/comment/child_comments/${parentCommentId}?${params.toString()}`;
        isChildComments=true;
    } else {
        api=`${backendUrl}/api/comment/comments/${postId}?${params.toString()}`;
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(api);
                isChildComments ? setComments(response.data.child_comments):setComments(response.data.comments);
                setNoOfPages(response.data.noOfPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchComments();
    },[postId,page,limit,parentCommentId])

    return {comments,setComments,isLoading,noOfPages};
}