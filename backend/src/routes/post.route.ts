import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createPost, fetchLikedPosts, fetchMyPosts, fetchPost, fetchPosts, likePost, removePost } from "../controllers/post.controller";

const router = express.Router();

router.post("/create",authenticatedUser,createPost);
router.get("/posts",fetchPosts);
router.post("/like",authenticatedUser,likePost);
router.get("/my_posts",authenticatedUser,fetchMyPosts);
router.get("/liked_posts",authenticatedUser,fetchLikedPosts);
router.delete("/delete/:postId",authenticatedUser,removePost);
router.get("/:postId",authenticatedUser,fetchPost);


export default router;
