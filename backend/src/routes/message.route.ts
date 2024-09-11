
import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createMessage, editMessage, fetchConversationMessages, fetchMessageReplies, removeMessage } from "../controllers/message.controller";

const router = express.Router();

router.get("/messages/:selectedId",authenticatedUser,fetchConversationMessages);
router.post("/create",authenticatedUser,createMessage);
router.delete("/:messageId",authenticatedUser,removeMessage);
router.put("/edit",authenticatedUser,editMessage);
router.get("/replies/:message_id",fetchMessageReplies);

export default router;