"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessageReplies = exports.editMessage = exports.removeMessage = exports.createMessage = exports.fetchConversationMessages = void 0;
const __1 = require("..");
const fetchConversationMessages = async (req, res) => {
    try {
        const { selectedId } = req.params; // participant 2
        const userId = req.userId; // participant 1
        const firstParticipant = await __1.client.user.findUnique({ where: { id: userId } });
        const secondParticipant = await __1.client.user.findUnique({ where: { id: selectedId } });
        if (!firstParticipant || !secondParticipant)
            return res.status(400).json({ "success": false, "message": "participants not available" });
        // check if conversation with following participants exists.
        // if it exists return conversation messages. else return 400
        const conversation = await __1.client.conversation.findFirst({ where: { OR: [{ first_participant_id: firstParticipant.id, second_participant_id: secondParticipant.id }, { first_participant_id: secondParticipant.id, second_participant_id: firstParticipant.id }] }, include: {
                Messages: {
                    orderBy: { message_created_at: "asc" },
                    include: {
                        reply_message: true,
                    }
                },
            } });
        if (!conversation)
            return res.status(400).json({ "success": false, "message": "No Conversation found" });
        return res.status(200).json({ "success": true, "messages": conversation.Messages });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching conversation" });
    }
};
exports.fetchConversationMessages = fetchConversationMessages;
const createMessage = async (req, res) => {
    try {
        const { receiver_id, message_text, reply_message_id } = req.body;
        const sender_id = req.userId;
        const sender = await __1.client.user.findUnique({ where: { id: sender_id } });
        const receiver = await __1.client.user.findUnique({ where: { id: receiver_id } });
        if (!receiver || !sender)
            return res.status(400).json({ "success": false, "message": "sender or receiver not found" });
        // if converstion between sender and receiver exists => create message for that conversation.
        // else create new conversation and create message
        const conversation = await __1.client.conversation.findFirst({ where: { OR: [{ first_participant_id: sender.id, second_participant_id: receiver.id }, { first_participant_id: receiver.id, second_participant_id: sender.id }] } });
        let newMessage;
        if (conversation) {
            newMessage = await __1.client.message.create({ data: { conversation_id: conversation.id, message_sender_id: sender.id, message_receiver_id: receiver.id, message_text: message_text.trim(), reply_message_id: reply_message_id }, include: {
                    reply_message: true,
                } });
        }
        else {
            const newConversation = await __1.client.conversation.create({ data: { first_participant_id: sender.id, second_participant_id: receiver.id } });
            newMessage = await __1.client.message.create({ data: { conversation_id: newConversation.id, message_sender_id: sender.id, message_receiver_id: receiver.id, message_text: message_text.trim(), reply_message_id: reply_message_id }, include: {
                    reply_message: true,
                } });
        }
        // SOCKET STUFF
        const receiverSocketId = (0, __1.getSocketId)(receiver.id);
        if (receiverSocketId) {
            __1.io.to(receiverSocketId).emit("send_message", newMessage);
        }
        return res.status(201).json({ "success": true, newMessage, "message": "message sent" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when sending a message" });
    }
};
exports.createMessage = createMessage;
const removeMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;
        const sender = await __1.client.user.findUnique({ where: { id: userId } });
        const message = await __1.client.message.findUnique({ where: { id: messageId } });
        if (!sender || !message)
            return res.status(400).json({ "success": false, "message": "message or message sender not available" });
        // checking if sender of message is the logged in user 
        if (message.message_sender_id !== sender.id)
            return res.status(400).json({ "success": false, "message": "user not sender of this message" });
        await __1.client.message.delete({ where: { id: message.id } });
        // message => sender id , receiver_id . send event to receiver to delete the following message
        const receiverSocketId = (0, __1.getSocketId)(message.message_receiver_id);
        if (receiverSocketId) {
            __1.io.to(receiverSocketId).emit("remove_message", message);
        }
        return res.status(200).json({ "success": true, "message": "deleted message" });
    }
    catch (error) {
        console.log(error);
    }
};
exports.removeMessage = removeMessage;
const editMessage = async (req, res) => {
    try {
        const { messageId, newMessageText } = req.body;
        const userId = req.userId;
        const sender = await __1.client.user.findUnique({ where: { id: userId } });
        const message = await __1.client.message.findUnique({ where: { id: messageId } });
        if (!sender || !message)
            return res.status(400).json({ "success": false, "message": "sender or message not available" });
        if (message.message_sender_id !== sender.id)
            return res.status(400).json({ "success": false, "message": "user is not sender of this message" });
        const newMessage = await __1.client.message.update({ where: { id: message.id }, data: { message_text: newMessageText.trim(), message_updated_at: new Date(), is_edited: true }, include: {
                reply_message: true,
            } });
        // emit event to receiver of this message to update the message 
        const receiverSocketId = (0, __1.getSocketId)(message.message_receiver_id);
        if (receiverSocketId) {
            __1.io.to(receiverSocketId).emit("edit_message", newMessage);
        }
        return res.status(200).json({ "success": true, newMessage, "message": "edited message" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when editing message" });
    }
};
exports.editMessage = editMessage;
const fetchMessageReplies = async (req, res) => {
    try {
        const { message_id } = req.params;
        const message = await __1.client.message.findUnique({ where: { id: message_id }, include: {
                replies: {
                    include: {
                        reply_message: true,
                    }
                }
            } });
        if (!message)
            return res.status(400).json({ "success": false, "message": "message not found" });
        return res.status(200).json({ "success": true, "replies": message.replies });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "something went wrong when fetching message replies" });
    }
};
exports.fetchMessageReplies = fetchMessageReplies;
