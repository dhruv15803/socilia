import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createComment, deleteComment, fetchChildComments, fetchPostComments, likeComment } from "../controllers/comment.controller";

const router = express.Router();


router.post("/create",authenticatedUser,createComment);
router.get("/comments/:postId",fetchPostComments);
router.get("/child_comments/:parent_comment_id",fetchChildComments);
router.post("/like",authenticatedUser,likeComment);
router.delete("/:commentId",authenticatedUser,deleteComment);

export default router;