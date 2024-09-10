import { AppContext } from '@/Context/AppContext';
import { AppContextType, Message } from '@/types';
import { useContext, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { formatMessageDate, postCreatedAt } from '@/utils';

type Props = {
    message: Message;
    removeMessage: (id: string) => Promise<void>;
    editMessage: (id: string, newMessageText: string) => Promise<void>;
}

const MessageCard = ({ message, removeMessage, editMessage }: Props) => {
    const { loggedInUser } = useContext(AppContext) as AppContextType;
    const [newMessageText, setNewMessageText] = useState<string>(message.message_text);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEditClick = () => {
        setIsEditDialogOpen(true);
    };

    const handleEditConfirm = () => {
        editMessage(message.id, newMessageText);
        setIsEditDialogOpen(false);
    };

    return (
        <>
            <div className={`flex flex-col pt-2 px-2 gap-2 border rounded-lg ${message.message_sender_id === loggedInUser?.id ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
                <div className='flex items-center justify-end gap-2'>
                    {message.is_edited && <span>edited</span>}
                    {message.message_sender_id === loggedInUser?.id && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button><BsThreeDots /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => removeMessage(message.id)}>
                                    Delete Message
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={handleEditClick}>
                                    Edit Message
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className='flex flex-wrap'>{message.message_text}</div>
                <div className='flex my-2 items-center border-t justify-between gap-4'>
                    <div>{postCreatedAt(message.message_created_at)}</div>
                    <div>{formatMessageDate(message.message_created_at)}</div>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Message</DialogTitle>
                        <DialogDescription>Update your message below.</DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        type='text'
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditConfirm}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MessageCard;
