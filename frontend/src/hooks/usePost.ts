import { backendUrl } from "@/App";
import { useToast } from "@/components/ui/use-toast";
import { Post } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"


export const usePost =  (postId:string) => { 
    const [post,setPost] = useState<Post | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/post/${postId}`,{
                    withCredentials:true,
                });
                console.log(response);
                setPost(response.data.post);
            } catch (error) {
                console.log(error);
                toast({title:"Couldn't find post" ,description:"Please refresh page"});
            } finally {
                setIsLoading(false);
            }
        }
        fetchPost();
    },[postId]);

    return {post,isLoading};
}