import { Request, Response } from "express"
import { client } from "..";

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
            Messages:true,
        }})
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
        return res.status(201).json({"success":true,newMessage,"message":"message sent"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when sending a message"});
    }
}

export {
    fetchConversationMessages,
    createMessage,
}