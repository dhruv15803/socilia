import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createComment, deleteComment, fetchPostComments } from "../controllers/comment.controller";

const router = express.Router();


router.post("/create",authenticatedUser,createComment);
router.get("/comments/:postId",fetchPostComments);
router.delete("/:commentId",authenticatedUser,deleteComment);

export default router;