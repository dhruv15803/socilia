import { AppContextType, Message } from '@/types';
import React, { SetStateAction, useContext } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useMessageReplies } from '@/hooks/useMessageReplies';
import Loader from './Loader';
import { AppContext } from '@/Context/AppContext';

type Props = {
    isViewReplies:boolean;
    setIsViewReplies:React.Dispatch<SetStateAction<boolean>>;
    message:Message;
}

const ViewMessageReplies = ({isViewReplies,message,setIsViewReplies}:Props) => {
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const {messageReplies,isLoading:isRepliesLoading} = useMessageReplies(message.id);
  return (
    <>
                <Dialog open={isViewReplies} onOpenChange={setIsViewReplies} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message Replies</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-wrap border-b p-2'>
                        {message.message_text}
                    </div>
                    {isRepliesLoading ? <>
                        <div className='flex items-center justify-center'>
                            <Loader width='80' height='80' color='black'/>
                            <span>Loading...</span>
                        </div>
                    </> : <>
                        {messageReplies.map((reply:Message) => {
                            return <div className={`flex flex-col p-2 border-b border-rounded-lg ${loggedInUser?.id===reply.message_sender_id ? "bg-blue-500 text-white" : "bg-gray-100"} `}>
                                {reply.message_text}
                            </div>
                        })}
                    </>}
                </DialogContent>
            </Dialog>
    </>
  )
}

export default ViewMessageReplies