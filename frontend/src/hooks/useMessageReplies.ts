import { backendUrl } from "@/App";
import { Message } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useMessageReplies = (messageId:string) => {
    const [messageReplies,setMessageReplies] = useState<Message[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessageReplies = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/message/replies/${messageId}`);
                setMessageReplies(response.data.replies);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMessageReplies();
    },[messageId]);

    return {messageReplies,setMessageReplies,isLoading};

}