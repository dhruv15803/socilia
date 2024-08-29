import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createComment, deleteComment, fetchPostComments, likeComment } from "../controllers/comment.controller";

const router = express.Router();


router.post("/create",authenticatedUser,createComment);
router.get("/comments/:postId",fetchPostComments);
router.delete("/:commentId",authenticatedUser,deleteComment);
router.post("/like",authenticatedUser,likeComment);

export default router;