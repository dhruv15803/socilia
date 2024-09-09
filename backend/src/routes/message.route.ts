
import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createMessage, editMessage, fetchConversationMessages, removeMessage } from "../controllers/message.controller";

const router = express.Router();

router.get("/messages/:selectedId",authenticatedUser,fetchConversationMessages);
router.post("/create",authenticatedUser,createMessage);
router.delete("/:messageId",authenticatedUser,removeMessage);
router.put("/edit",authenticatedUser,editMessage);

export default router;