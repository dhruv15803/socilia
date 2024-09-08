
import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createMessage, fetchConversationMessages } from "../controllers/message.controller";

const router = express.Router();

router.get("/messages/:selectedId",authenticatedUser,fetchConversationMessages);
router.post("/create",authenticatedUser,createMessage);

export default router;