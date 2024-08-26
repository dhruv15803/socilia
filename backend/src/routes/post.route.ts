import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createPost, fetchPost, fetchPosts, likePost } from "../controllers/post.controller";

const router = express.Router();

router.post("/create",authenticatedUser,createPost);
router.get("/posts",fetchPosts);
router.post("/like",authenticatedUser,likePost);
router.get("/:postId",authenticatedUser,fetchPost);

export default router;
