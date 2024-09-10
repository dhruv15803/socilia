import { Request, Response } from "express"
import { client, getSocketId, io } from "..";

type Message = {
    id: string;
    message_sender_id: string;
    message_receiver_id: string;
    message_text: string;
    conversation_id: string;
    message_images: string[];
    message_created_at: Date;
    message_updated_at: Date | null;
};

const fetchConversationMessages = async (req:Request,res:Response) => {
    try {
        const {selectedId} = req.params; // participant 2
        const userId = req.userId; // participant 1
        const firstParticipant = await client.user.findUnique({where:{id:userId}});
        const secondParticipant = await client.user.findUnique({where:{id:selectedId}});
        if(!firstParticipant || !secondParticipant) return res.status(400).json({"success":false,"message":"participants not available"});
    
        // check if conversation with following participants exists.
        // if it exists return conversation messages. else return 400
        const conversation = await client.conversation.findFirst({where:{OR:[{first_participant_id:firstParticipant.id,second_participant_id:secondParticipant.id},{first_participant_id:secondParticipant.id,second_participant_id:firstParticipant.id}]},include:{
            Messages:{
                orderBy:{message_created_at:"asc"},
            },
        }});
        if(!conversation) return res.status(400).json({"success":false,"message":"No Conversation found"});
        return res.status(200).json({"success":true,"messages":conversation.Messages});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching conversation"});
    }
}

const createMessage = async (req:Request,res:Response) => {
    try {
        const {receiver_id,message_text} = req.body
        const sender_id = req.userId;
        const sender = await client.user.findUnique({where:{id:sender_id}});
        const receiver = await client.user.findUnique({where:{id:receiver_id}});
        if(!receiver || !sender) return res.status(400).json({"success":false,"message":"sender or receiver not found"});
    
        // if converstion between sender and receiver exists => create message for that conversation.
        // else create new conversation and create message
        const conversation = await client.conversation.findFirst({where:{OR:[{first_participant_id:sender.id,second_participant_id:receiver.id},{first_participant_id:receiver.id,second_participant_id:sender.id}]}});
        let newMessage:Message;
        if(conversation) {
            newMessage = await client.message.create({data:{conversation_id:conversation.id,message_sender_id:sender.id,message_receiver_id:receiver.id,message_text:message_text.trim()}});
        } else {
            const newConversation = await client.conversation.create({data:{first_participant_id:sender.id,second_participant_id:receiver.id}});
            newMessage = await client.message.create({data:{conversation_id:newConversation.id,message_sender_id:sender.id,message_receiver_id:receiver.id,message_text:message_text.trim()}});
        }

        // SOCKET STUFF
        const receiverSocketId = getSocketId(receiver.id);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("send_message",newMessage);
        }
        return res.status(201).json({"success":true,newMessage,"message":"message sent"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when sending a message"});
    }
}


const removeMessage = async (req:Request,res:Response) => {
    try {
        const {messageId} = req.params;
        const userId = req.userId;
        const sender = await client.user.findUnique({where:{id:userId}});
        const message = await client.message.findUnique({where:{id:messageId}});
        if(!sender || !message) return res.status(400).json({"success":false,"message":"message or message sender not available"});
        // checking if sender of message is the logged in user 
        if(message.message_sender_id!==sender.id) return res.status(400).json({"success":false,"message":"user not sender of this message"});
        await client.message.delete({where:{id:message.id}});
        // message => sender id , receiver_id . send event to receiver to delete the following message
        const receiverSocketId = getSocketId(message.message_receiver_id);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("remove_message",message);
        }

        return res.status(200).json({"success":true,"message":"deleted message"});
    } catch (error) {
        console.log(error);
    }
}



const editMessage = async (req:Request,res:Response) => {
    try {
        const {messageId,newMessageText} = req.body;
        const userId = req.userId;
        const sender = await client.user.findUnique({where:{id:userId}});
        const message = await client.message.findUnique({where:{id:messageId}});
        if(!sender || !message) return res.status(400).json({"success":false,"message":"sender or message not available"});
    
        if(message.message_sender_id!==sender.id) return res.status(400).json({"success":false,"message":"user is not sender of this message"});
    
        const newMessage = await client.message.update({where:{id:message.id},data:{message_text:newMessageText.trim(),message_updated_at:new Date(),is_edited:true}});
        
        // emit event to receiver of this message to update the message 
        const receiverSocketId = getSocketId(message.message_receiver_id);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("edit_message",newMessage);
        }
        
        return res.status(200).json({"success":true,newMessage,"message":"edited message"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when editing message"});
    }
}

export {
    fetchConversationMessages,
    createMessage,
    removeMessage,
    editMessage,
}