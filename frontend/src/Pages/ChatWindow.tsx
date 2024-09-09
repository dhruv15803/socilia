import { backendUrl } from '@/App';
import Loader from '@/components/Loader';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppContext } from '@/Context/AppContext';
import { useConversation } from '@/hooks/useConversation';
import { useGetUser } from '@/hooks/useGetUser';
import { AppContextType } from '@/types';
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { RxAvatar } from 'react-icons/rx';
import { useParams } from 'react-router-dom'

const ChatWindow = () => {
    const {selectedId} = useParams();    
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const {isLoading:isUserLoading,user:selectedUser} = useGetUser(selectedId!);
    const {isMessagesLoading,messages,setMessages} = useConversation(selectedId!);
    const [messageText,setMessageText] = useState<string>("");
    const [isSendingMessage,setIsSendingMessage] = useState<boolean>(false);


    const removeMessage = async (messageId:string) => {
        const prevMessages = messages;
        try {
            const newMessages = messages.filter((message) => message.id!==messageId);
            setMessages(newMessages);
            await axios.delete(`${backendUrl}/api/message/${messageId}`,{
                withCredentials:true,
            });
        } catch (error) {
            console.log(error);
            setMessages(prevMessages);
        }
    } 

    const editMessage = async (messageId:string,newMessageText:string) => {
        const prevMessages = messages;
        try {
            const newMessages = messages.map((message) => {
                if(message.id===messageId) {
                    return {
                        ...message,
                        "message_text":newMessageText,
                        "message_updated_at":new Date().toISOString(),
                    }
                } else {
                    return message;
                }
            });
            setMessages(newMessages);
            await axios.put(`${backendUrl}/api/message/edit`,{
                messageId,
                newMessageText,
            },{
                withCredentials:true,
            });
        } catch (error) {
            console.log(error);
            setMessages(prevMessages);
        }
    }

    const handleSendMessage = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsSendingMessage(true);
            const response = await axios.post(`${backendUrl}/api/message/create`,{
                "receiver_id":selectedUser?.id,
                "message_text":messageText,
            },{
                withCredentials:true,
            });
            setMessageText("");
            setMessages((prevMessages) => [...prevMessages , response.data.newMessage]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSendingMessage(false);
        }
    }

  return (
    <>
        <div className='flex flex-col border rounded-lg ml-64 w-full'>
            <div className='fixed top-0 z-10 w-full bg-white p-4 border-b border-black justify-between'>
                {(isUserLoading && !selectedUser) ? <>
                    <Loader width='20' height='20' color='black'/>
                    <span>...</span>
                </>  : <>
                    <div className='flex items-center gap-2'>
                    {selectedUser?.user_image!==null ? <><img src={selectedUser?.user_image} alt="" /></> : <><button className='text-3xl'><RxAvatar/></button></>}
                    <span className='text-xl font-semibold'>{selectedUser?.username}</span>
                </div>  
                </>}
            </div>
            <div className='flex flex-col gap-2 p-2 mt-16'>
                {isMessagesLoading ? <>
                    <div className='flex items-center gap-2 justify-center'>
                        <Loader width='80' height='80' color='black'/>
                        <span className='font-semibold'>Messages...</span>
                    </div>
                </> : <>
                    {messages?.map((message) => {
                        if(message.message_sender_id===loggedInUser?.id) {
                            return <div key={message.id} className='flex items-center justify-end'>
                                <MessageCard editMessage={editMessage} removeMessage={removeMessage} message={message}/>
                            </div>
                        } else {
                            return <div key={message.id} className='flex items-center justify-start'>
                                <MessageCard editMessage={editMessage} removeMessage={removeMessage} message={message}/>
                            </div>
                        }
                    })}
                </>}
                <form className='flex items-center gap-4' onSubmit={(e) => handleSendMessage(e)}>
                    <Input value={messageText} onChange={(e) => setMessageText(e.target.value)} type='text' placeholder='Enter Message'/>
                    <Button disabled={isSendingMessage || messageText.trim()===""}>Send</Button>
                </form>
            </div>
        </div>
    </>
  )
}

export default ChatWindow