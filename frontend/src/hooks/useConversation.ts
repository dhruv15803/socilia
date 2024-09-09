import { backendUrl } from "@/App";
import { Message } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useConversation = (selectedId:string) => {
    const [messages,setMessages] = useState<Message[]>([]);
    const [isMessagesLoading,setIsMessagesLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchConversationMessages = async () => {
            try {
                setIsMessagesLoading(true);
                const response=await axios.get(`${backendUrl}/api/message/messages/${selectedId}`,{
                    withCredentials:true,
                });
                setMessages(response.data.messages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsMessagesLoading(false);
            }
        }
        fetchConversationMessages();
    },[selectedId]);

    return {isMessagesLoading,messages,setMessages};
}