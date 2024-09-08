import { backendUrl } from "@/App";
import axios from "axios";
import { useEffect, useState } from "react"
import { Message } from "react-hook-form";



export const useConversationMessages = (selectedId:string) => {
    const [messages,setMessages] = useState<Message[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchConversationMessages = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/message/messages/${selectedId}`,{
                    withCredentials:true,
                });
                setMessages(response.data.messages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchConversationMessages();
    },[selectedId])

    return {isLoading,messages,setMessages};

}