import { backendUrl } from '@/App';
import Loader from '@/components/Loader';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppContext } from '@/Context/AppContext';
import { SocketContext } from '@/Context/SocketContext';
import { useConversation } from '@/hooks/useConversation';
import { useGetUser } from '@/hooks/useGetUser';
import { AppContextType, Message, SocketContextType } from '@/types';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { RxAvatar } from 'react-icons/rx';
import { useParams } from 'react-router-dom'



const ChatWindow = () => {
    const {selectedId} = useParams();    
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const {isLoading:isUserLoading,user:selectedUser} = useGetUser(selectedId!);
    const {isMessagesLoading,messages,setMessages} = useConversation(selectedId!);
    const [messageText,setMessageText] = useState<string>("");
    const [isSendingMessage,setIsSendingMessage] = useState<boolean>(false);
    const {socket} = useContext(SocketContext) as SocketContextType;

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
                        "is_edited":true,
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
            setMessages((prevMessages) => [...prevMessages ,response.data.newMessage]);
        } catch (error) {
            console.log(error);
        } finally {
        }
        setIsSendingMessage(false);
    }

    useEffect(() => {
        const handleRemoveMessage = (deleteMessage: Message) => {
            setMessages((prevMessages) => 
                prevMessages.filter((message) => message.id !== deleteMessage.id)
            );
        };
    
        const handleNewMessage = (newMessage: Message) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        const handleEditMessage = (newMessage:Message) => {
            setMessages((messages) =>messages.map((message) => {
                if(message.id===newMessage.id) {
                   return newMessage;
                } else {
                    return message;
                }
            })) 
        };
    
        socket?.on("remove_message", handleRemoveMessage);
        socket?.on("send_message", handleNewMessage);
        socket?.on("edit_message",handleEditMessage);
    
        return () => {
            socket?.off("remove_message", handleRemoveMessage);
            socket?.off("send_message", handleNewMessage);
            socket?.off("edit_message",handleEditMessage);
        };
    }, [socket, setMessages]);


  return (
    <>
        <div className='flex flex-col border rounded-lg ml-64 w-full'>
            <div className='flex justify-between items-center top-0 z-10 w-full bg-white p-4 border-b border-black'>
                {(isUserLoading && !selectedUser) ? <>
                    <Loader width='20' height='20' color='black'/>
                    <span>...</span>
                </>  : <>
                    <div className='flex items-center gap-2'>
                        {selectedUser?.user_image!==null ? <><img src={selectedUser?.user_image} alt="" /></> : <><button className='text-3xl'><RxAvatar/></button></>}
                        <span className='text-xl font-semibold'>{selectedUser?.username}</span>
                    </div>  
                </>}
                <button><BsThreeDots/></button>
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